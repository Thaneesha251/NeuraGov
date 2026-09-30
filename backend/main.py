import os
from fastapi import FastAPI, Depends, HTTPException, Query, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
import shutil

from database import engine, get_db, Base
from models import DBReport, ReportCreate, ReportResponse, StatusUpdate, StatsResponse, AIAnalysisResult
from ai_service import analyze_report
from seed import seed_database

# Initialize Database tables and Seed Data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="NeuraGov API",
    description="AI-Powered Public Service Intelligence Governance Engine",
    version="1.0.0"
)

# CORS Middleware setup to allow Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory setup
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "NeuraGov AI Governance Platform",
        "docs": "/docs"
    }


@app.post("/api/reports/analyze", response_model=AIAnalysisResult)
def preview_analysis(report: ReportCreate):
    """
    AI Preview Endpoint: Analyzes issue description and returns structured JSON AI analysis
    without creating a persistent database record.
    """
    if not report.description or len(report.description.strip()) < 5:
        raise HTTPException(status_code=400, detail="Report description must be at least 5 characters.")
    
    ai_result = analyze_report(
        description=report.description,
        location=report.location,
        user_category=report.category
    )
    return ai_result


@app.post("/api/reports", response_model=ReportResponse, status_code=210)
@app.post("/api/reports/", response_model=ReportResponse, status_code=201)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    """
    Create Report Endpoint:
    1. Triggers AI Service (Gemini API or intelligent rule-based engine)
    2. Extracts category, priority, department, summary, action, reason
    3. Stores report into SQLite DB
    4. Returns complete structured report response
    """
    if not report.description or not report.location:
        raise HTTPException(status_code=400, detail="Description and location are required.")

    # Execute AI Analysis
    ai_analysis = analyze_report(
        description=report.description,
        location=report.location,
        user_category=report.category
    )

    db_report = DBReport(
        description=report.description,
        location=report.location,
        category=ai_analysis.category,
        priority=ai_analysis.priority,
        department=ai_analysis.department,
        summary=ai_analysis.summary,
        recommended_action=ai_analysis.recommended_action,
        reason=ai_analysis.reason,
        status="Pending",
        image_url=report.image_data,
        reporter_name=report.reporter_name or "Anonymous Citizen"
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@app.get("/api/reports", response_model=List[ReportResponse])
@app.get("/api/reports/", response_model=List[ReportResponse])
def get_reports(
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Fetch all citizen reports with optional filtering & search for Admin Dashboard
    """
    query = db.query(DBReport)

    if status and status != "All":
        query = query.filter(DBReport.status == status)
    if category and category != "All":
        query = query.filter(DBReport.category == category)
    if priority and priority != "All":
        query = query.filter(DBReport.priority == priority)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                DBReport.description.ilike(search_fmt),
                DBReport.location.ilike(search_fmt),
                DBReport.summary.ilike(search_fmt),
                DBReport.department.ilike(search_fmt),
                DBReport.reporter_name.ilike(search_fmt)
            )
        )

    # Order by newest first
    reports = query.order_by(DBReport.created_at.desc()).all()
    return reports


@app.get("/api/reports/{report_id}", response_model=ReportResponse)
def get_report_by_id(report_id: int, db: Session = Depends(get_db)):
    report = db.query(DBReport).filter(DBReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@app.patch("/api/reports/{report_id}/status", response_model=ReportResponse)
def update_report_status(report_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    """
    Update status of a report (Pending -> In Progress -> Resolved)
    """
    if status_update.status not in ["Pending", "In Progress", "Resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status value. Must be 'Pending', 'In Progress', or 'Resolved'")
        
    report = db.query(DBReport).filter(DBReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    report.status = status_update.status
    db.commit()
    db.refresh(report)
    return report


@app.get("/api/stats", response_model=StatsResponse)
@app.get("/api/stats/", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """
    Get aggregated counts and distribution metrics for Admin Dashboard
    """
    total = db.query(DBReport).count()
    pending = db.query(DBReport).filter(DBReport.status == "Pending").count()
    in_progress = db.query(DBReport).filter(DBReport.status == "In Progress").count()
    resolved = db.query(DBReport).filter(DBReport.status == "Resolved").count()
    
    high_critical = db.query(DBReport).filter(
        DBReport.priority.in_(["High", "Critical"])
    ).count()

    # Category distribution
    cat_rows = db.query(DBReport.category, func.count(DBReport.id)).group_by(DBReport.category).all()
    category_dist = {cat: count for cat, count in cat_rows}

    # Priority distribution
    prio_rows = db.query(DBReport.priority, func.count(DBReport.id)).group_by(DBReport.priority).all()
    priority_dist = {prio: count for prio, count in prio_rows}

    # Status distribution
    status_dist = {
        "Pending": pending,
        "In Progress": in_progress,
        "Resolved": resolved
    }

    return StatsResponse(
        total_reports=total,
        pending_reports=pending,
        in_progress_reports=in_progress,
        high_critical_reports=high_critical,
        resolved_reports=resolved,
        category_distribution=category_dist,
        priority_distribution=priority_dist,
        status_distribution=status_dist
    )
