from datetime import datetime, timedelta, timezone
from database import SessionLocal, engine, Base
from models import DBReport

SEED_REPORTS = [
    {
        "description": "There has been no streetlight working near the college entrance for the last five days.",
        "location": "St. Mary's College Main Gate, Park Avenue",
        "category": "Streetlight & Electricity",
        "priority": "High",
        "department": "Electrical & Public Works",
        "summary": "Streetlight failure near college entrance",
        "recommended_action": "Inspect electrical wiring and replace faulty fixture at college entrance.",
        "reason": "The issue affects a frequently used public location and has remained unresolved for several days.",
        "status": "Pending",
        "reporter_name": "Anita Sharma",
        "image_url": "https://images.unsplash.com/photo-1517649763962-0c623266ecf0?w=500&auto=format&fit=crop",
        "hours_ago": 2
    },
    {
        "description": "Large deep pothole on the right lane near the central metro station, causing severe traffic slowing and vehicle damage.",
        "location": "Metro Pillar 142, MG Road Junction",
        "category": "Roads & Potholes",
        "priority": "Critical",
        "department": "Roads & Transportation Dept",
        "summary": "Hazardous deep pothole on main artery",
        "recommended_action": "Dispatch emergency road crew with hot asphalt patch mix immediately.",
        "reason": "Located on major commuter corridor near transit hub; extreme risk of accident during peak hours.",
        "status": "In Progress",
        "reporter_name": "Rahul Verma",
        "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop",
        "hours_ago": 5
    },
    {
        "description": "Water pipe burst leaking drinking water onto the main street, creating waterlogging and pressure loss in residential area.",
        "location": "Sector 4, Near City Hospital",
        "category": "Water & Drainage",
        "priority": "Critical",
        "department": "Water Supply & Sewerage Board",
        "summary": "Main water pipeline burst near City Hospital",
        "recommended_action": "Isolate main valve line 4B and repair pipe union joint.",
        "reason": "Proximity to emergency hospital access and risk of severe municipal water waste.",
        "status": "In Progress",
        "reporter_name": "Dr. S. K. Gupta",
        "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186c557?w=500&auto=format&fit=crop",
        "hours_ago": 12
    },
    {
        "description": "Municipal waste bin overflowing onto sidewalk for 3 days. Strong odor and stray animals scattering trash.",
        "location": "Market Complex, Block B, Green Park",
        "category": "Waste & Sanitation",
        "priority": "High",
        "department": "Sanitation & Waste Management",
        "summary": "Severe garbage overflow at commercial market",
        "recommended_action": "Deploy compactor truck for clearance and perform chemical spraying.",
        "reason": "Commercial public zone with food stalls; poses sanitation hazard if neglected.",
        "status": "Pending",
        "reporter_name": "Priya Nair",
        "image_url": None,
        "hours_ago": 18
    },
    {
        "description": "Traffic signal light stuck on red in all directions, causing gridlock at 4-way intersection.",
        "location": "Crossroads 5th & 12th Main, Indiranagar",
        "category": "Traffic & Signals",
        "priority": "High",
        "department": "Traffic Engineering Division",
        "summary": "Traffic light malfunction at busy 4-way intersection",
        "recommended_action": "Reset logic board and recalibrate signal timers.",
        "reason": "Active vehicular congestion risk and immediate potential for collisions.",
        "status": "Resolved",
        "reporter_name": "Vikram Sethi",
        "image_url": None,
        "hours_ago": 28
    },
    {
        "description": "Broken children's swing frame and exposed metal bolt in public community park.",
        "location": "Sunrise Children's Park, Sector 9",
        "category": "Parks & Environment",
        "priority": "Medium",
        "department": "Horticulture & Parks Dept",
        "summary": "Damaged playground equipment in public park",
        "recommended_action": "Cordon off swing set and weld replacement hinge support.",
        "reason": "Direct safety hazard for young children using park playground.",
        "status": "Resolved",
        "reporter_name": "Meera Patel",
        "image_url": None,
        "hours_ago": 36
    },
    {
        "description": "Storm drain clogged with leaves and plastic debris causing rainwater puddle accumulation near bus stop.",
        "location": "Bus Stop #12, Ring Road",
        "category": "Water & Drainage",
        "priority": "Medium",
        "department": "Water Supply & Sewerage Board",
        "summary": "Clogged storm drain near commuter bus shelter",
        "recommended_action": "Clear storm drain grate and scoop leaf sludge.",
        "reason": "Impairs commuter access to public transit during rains.",
        "status": "Pending",
        "reporter_name": "Karan Malhotra",
        "image_url": None,
        "hours_ago": 42
    },
    {
        "description": "Fallen tree branch hanging over overhead power lines after last night's storm.",
        "location": "Oak Street, House #45",
        "category": "Public Infrastructure",
        "priority": "High",
        "department": "Electrical & Public Works",
        "summary": "Tree branch weighing on electrical line",
        "recommended_action": "Send tree trimming vehicle with insulated lift to clear branch.",
        "reason": "Risk of power outage or downed line safety hazard.",
        "status": "Pending",
        "reporter_name": "Sunil Roy",
        "image_url": None,
        "hours_ago": 48
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        count = db.query(DBReport).count()
        if count == 0:
            print("Seeding initial public service reports into database...")
            now = datetime.now(timezone.utc)
            for item in SEED_REPORTS:
                hours = item.pop("hours_ago")
                created = now - timedelta(hours=hours)
                report = DBReport(
                    **item,
                    created_at=created,
                    updated_at=created
                )
                db.add(report)
            db.commit()
            print(f"Successfully seeded {len(SEED_REPORTS)} demo reports!")
        else:
            print(f"Database already contains {count} reports. Skipping seed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
