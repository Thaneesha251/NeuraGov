from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from database import Base

class DBReport(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    priority = Column(String(50), nullable=False)
    department = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="Pending", nullable=False)
    image_url = Column(Text, nullable=True)
    reporter_name = Column(String(100), default="Anonymous Citizen")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

# Pydantic Schemas
class AIAnalysisResult(BaseModel):
    category: str
    priority: str
    department: str
    summary: str
    recommended_action: str
    reason: str

class ReportCreate(BaseModel):
    description: str
    location: str
    category: Optional[str] = None  # If provided by citizen, or None to auto-detect
    image_data: Optional[str] = None # Base64 encoded or image URL
    reporter_name: Optional[str] = "Anonymous Citizen"

class StatusUpdate(BaseModel):
    status: str  # Pending, In Progress, Resolved

class ReportResponse(BaseModel):
    id: int
    description: str
    location: str
    category: str
    priority: str
    department: str
    summary: str
    recommended_action: str
    reason: str
    status: str
    image_url: Optional[str] = None
    reporter_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    total_reports: int
    pending_reports: int
    in_progress_reports: int
    high_critical_reports: int
    resolved_reports: int
    category_distribution: Dict[str, int]
    priority_distribution: Dict[str, int]
    status_distribution: Dict[str, int]
