# NeuraGov – AI-Powered Public Service Intelligence 🏛️🤖

**NeuraGov** is a state-of-the-art governance platform designed to convert citizen public-service reports into structured, actionable intelligence. It automatically classifies complaints, determines urgency priority, extracts key details, recommends field engineering actions, and routes issues to appropriate government departments.

---

## 🌟 Features

### 1. Citizen Portal
- **Smart Issue Submission Form**: Submit description, location, category preference, and optional image upload.
- **Hackathon Quick Test Presets**: One-click demo buttons pre-fill sample complaints (e.g., Streetlight issue near college entrance, main highway pothole, water pipe burst).
- **Instant AI Preview**: Click "AI Preview" to view real-time AI classification before submitting.
- **Structured AI Feedback**: Displays category, priority chip, assigned department badge, recommended action plan, and risk rationale immediately upon submission.

### 2. Admin Governance Dashboard
- **Real-Time Key Metrics**: Total Reports, Pending Triage, High/Critical Urgency, and Resolved Issues.
- **Interactive Visual Analytics**: Category distribution bar charts & priority breakdown donut charts powered by Recharts.
- **Live Complaint Management Table**:
  - Filter by Status (*Pending*, *In Progress*, *Resolved*), Priority (*Low*, *Medium*, *High*, *Critical*), Category, or Search keywords.
  - Inline status update dropdowns for instant administrative state changes.
  - Detail modal with complete AI reasoning breakdown and raw structured JSON schema exporter.

### 3. Dual AI Engine Architecture
- **Google Gemini API**: Isolated structure in `backend/ai_service.py`. Automatically uses Gemini 1.5/3.0 when `GEMINI_API_KEY` is present.
- **Smart Heuristic Fallback Engine**: Comprehensive rule-based NLP classifier ensuring complete functionality out-of-the-box even without API keys.

---

## 🏗️ Technology Stack

- **Frontend**: React (v18), Vite, TypeScript, Material UI (MUI v5), Recharts, Lucide Icons
- **Backend**: FastAPI, Python 3.14, SQLAlchemy, Pydantic, SQLite (with automatic demo data seeding)
- **AI Integration**: Google Gemini API structure + Heuristic Fallback Engine

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

---

### Step 1: Start the Backend (FastAPI)

1. Open a terminal in the project directory:
   ```bash
   cd backend
   ```

2. (Optional) Set your Gemini API Key if available:
   ```bash
   # On Windows PowerShell
   $env:GEMINI_API_KEY="your_actual_gemini_api_key"
   ```

3. Create virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

The backend server will run at: **`http://127.0.0.1:8000`**
Swagger API Docs available at: **`http://127.0.0.1:8000/docs`**

---

### Step 2: Start the Frontend (React + Vite)

1. Open a second terminal window:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The web application will open at: **`http://localhost:3000`**

---

## 📄 AI Response JSON Format

The backend AI service returns structured JSON matching this exact schema:

```json
{
  "category": "Streetlight & Electricity",
  "priority": "Critical",
  "department": "Electrical & Public Works",
  "summary": "Streetlight failure near college entrance",
  "recommended_action": "Inspect electrical wiring and repair/replace fixture at St. Mary College Main Gate.",
  "reason": "Presents a potential night-time safety hazard for pedestrians and commuters."
}
```
