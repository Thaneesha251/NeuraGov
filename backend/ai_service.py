import os
import json
import re
from typing import Optional
from models import AIAnalysisResult

# Categories standard list
VALID_CATEGORIES = [
    "Streetlight & Electricity",
    "Roads & Potholes",
    "Water & Drainage",
    "Waste & Sanitation",
    "Public Infrastructure",
    "Traffic & Signals",
    "Parks & Environment",
    "Public Safety & Health"
]

MOCK_RULES = [
    {
        "keywords": ["streetlight", "light", "dark", "lamp", "electric", "power", "wire", "spark", "transformer"],
        "category": "Streetlight & Electricity",
        "department": "Electrical & Public Works",
        "action_template": "Inspect electrical wiring and repair/replace fixture at {location}.",
        "reason_template": "Presents a potential night-time safety hazard for pedestrians and commuters."
    },
    {
        "keywords": ["pothole", "road", "asphalt", "crack", "crater", "caved", "pavement", "tarmac", "divider"],
        "category": "Roads & Potholes",
        "department": "Roads & Transportation Dept",
        "action_template": "Dispatch road maintenance unit to fill pothole/repair asphalt surface near {location}.",
        "reason_template": "Road defect creates immediate vehicle damage risk and traffic bottleneck."
    },
    {
        "keywords": ["water", "leak", "pipe", "burst", "drain", "flood", "sewage", "overflow", "drinking", "stagnant"],
        "category": "Water & Drainage",
        "department": "Water Supply & Sewerage Board",
        "action_template": "Send emergency plumbing team to isolate leak and repair pipeline at {location}.",
        "reason_template": "Water leakage wastes municipal resources and risks localized flooding or contamination."
    },
    {
        "keywords": ["garbage", "trash", "waste", "bin", "dump", "smell", "sanitation", "litter", "cleaning", "refuse"],
        "category": "Waste & Sanitation",
        "department": "Sanitation & Waste Management",
        "action_template": "Schedule heavy waste collection crew and sanitize container area at {location}.",
        "reason_template": "Accumulated uncollected waste causes severe health concerns and pest attraction."
    },
    {
        "keywords": ["signal", "traffic", "light", "intersection", "jam", "crossing", "bollard", "signboard"],
        "category": "Traffic & Signals",
        "department": "Traffic Engineering Division",
        "action_template": "Deploy traffic technician to recalibrate signal controller and fix sequence at {location}.",
        "reason_template": "Malfunctioning traffic signals increase risk of vehicular collisions and congestion."
    },
    {
        "keywords": ["park", "bench", "tree", "playground", "swing", "fence", "garden", "branch"],
        "category": "Parks & Environment",
        "department": "Horticulture & Parks Dept",
        "action_template": "Dispatch maintenance crew to audit and restore public park facilities at {location}.",
        "reason_template": "Damaged park amenities compromise public recreation safety."
    },
    {
        "keywords": ["building", "bridge", "wall", "manhole", "footpath", "sidewalk", "structure", "bus stop", "bench"],
        "category": "Public Infrastructure",
        "department": "Civil Infrastructure Dept",
        "action_template": "Perform structural stability inspection and deploy masonry repair team at {location}.",
        "reason_template": "Infrastructure breakdown impacts pedestrian safety and urban accessibility."
    }
]

def determine_priority(text: str) -> tuple[str, str]:
    text_lower = text.lower()
    
    # Critical indicators
    critical_terms = ["hospital", "school", "college", "fire", "sparking", "exposed wire", "burst pipe", "flooding", "gushing", "collapsed", "emergency", "fatal", "hazard"]
    if any(term in text_lower for term in critical_terms):
        return "Critical", "High public impact area or severe hazard identified requiring immediate emergency response."

    # High indicators
    high_terms = ["days", "week", "blocked", "heavy", "overflowing", "major", "main road", "highway", "multiple", "darkness", "danger"]
    if any(term in text_lower for term in high_terms):
        return "High", "Issue has persisted for extended duration or affects a high-traffic public space."

    # Medium indicators
    medium_terms = ["moderate", "broken", "smell", "cracked", "slow", "nuisance"]
    if any(term in text_lower for term in medium_terms):
        return "Medium", "Requires timely repair within 48 hours to prevent escalation."

    return "Low", "Routine maintenance issue with minimal immediate public hazard."


def mock_ai_analyze(description: str, location: str, user_category: Optional[str] = None) -> AIAnalysisResult:
    desc_lower = description.lower()
    
    matched_rule = None
    for rule in MOCK_RULES:
        if any(kw in desc_lower for kw in rule["keywords"]):
            matched_rule = rule
            break
            
    if not matched_rule:
        matched_rule = {
            "category": user_category or "Public Infrastructure",
            "department": "General Public Services",
            "action_template": "Assign municipal field worker to assess situation at {location}.",
            "reason_template": "Report filed by citizen requires site verification and appropriate routing."
        }

    category = user_category if (user_category and user_category != "Auto-Detect") else matched_rule["category"]
    department = matched_rule["department"]
    
    priority, priority_reason = determine_priority(description)
    
    # Extract clean summary
    clean_desc = description.strip()
    if len(clean_desc) > 80:
        summary = clean_desc[:77] + "..."
    else:
        summary = clean_desc
        
    recommended_action = matched_rule["action_template"].format(location=location or "specified location")
    reason = f"{matched_rule['reason_template']} {priority_reason}"

    return AIAnalysisResult(
        category=category,
        priority=priority,
        department=department,
        summary=summary,
        recommended_action=recommended_action,
        reason=reason
    )

def gemini_ai_analyze(description: str, location: str, user_category: Optional[str] = None) -> Optional[AIAnalysisResult]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    try:
        # We try using google-genai or google-generativeai package if available
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
        You are NeuraGov AI, an intelligent government public service routing & classification agent.
        Analyze the following citizen report and return ONLY a valid JSON object.

        Citizen Report Description: "{description}"
        Location: "{location}"
        Citizen Provided Category: "{user_category or 'Not specified'}"

        Return JSON matching this exact structure:
        {{
            "category": "<One of: Streetlight & Electricity, Roads & Potholes, Water & Drainage, Waste & Sanitation, Public Infrastructure, Traffic & Signals, Parks & Environment, Public Safety & Health>",
            "priority": "<One of: Low, Medium, High, Critical>",
            "department": "<Appropriate Government Department, e.g., Electrical & Public Works, Roads & Transportation Dept, Water Supply Board, Sanitation & Waste Management>",
            "summary": "<Concise 1-sentence summary of the core issue>",
            "recommended_action": "<Specific actionable recommendation for municipal field engineers>",
            "reason": "<Detailed justification for why this priority and department were chosen based on location, severity, and risk>"
        }}
        Do not include markdown code block formatting (like ```json), just pure raw JSON string.
        """

        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean potential markdown wrapping
        text = re.sub(r"^```json\s*", "", text)
        text = re.sub(r"^```\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        
        data = json.loads(text)
        return AIAnalysisResult(
            category=data.get("category", "Public Infrastructure"),
            priority=data.get("priority", "Medium"),
            department=data.get("department", "Public Works"),
            summary=data.get("summary", description[:80]),
            recommended_action=data.get("recommended_action", "Inspect location and take action."),
            reason=data.get("reason", "Based on automated analysis.")
        )
    except Exception as e:
        print(f"Gemini API call failed or not configured. Falling back to mock engine. Error: {e}")
        return None

def analyze_report(description: str, location: str, user_category: Optional[str] = None) -> AIAnalysisResult:
    # Try Gemini API if key is available
    result = gemini_ai_analyze(description, location, user_category)
    if result:
        return result
        
    # Fallback to local rule-based mock engine
    return mock_ai_analyze(description, location, user_category)
