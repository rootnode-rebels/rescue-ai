# RescueAI – AI-Powered Disaster Response & Emergency Coordination Platform

RescueAI is a professional, high-performance platform engineered to streamline emergency response, real-time crisis management, and resource allocation during disasters.

---

## 🏗️ Project Architecture

```
RescueAI/
├── frontend/             # Next.js 15 App Router Frontend (TypeScript, Tailwind CSS)
│   └── src/
│       ├── app/          # App Router Pages & Routes
│       ├── components/   # UI Components (Landing, Auth, Dashboard)
│       ├── layouts/      # Layout Wrappers
│       ├── hooks/        # Custom React Hooks
│       ├── services/     # API Services & HTTP Clients
│       ├── context/      # React Context State Providers
│       ├── lib/          # Helper Libraries & Utility Configurations
│       ├── types/        # TypeScript Type Definitions & Interfaces
│       ├── utils/        # Utility Functions
│       ├── constants/    # Application Constants & Enums
│       └── assets/       # Static Media Assets
├── backend/              # FastAPI Backend (Python 3.12)
│   └── app/
│       ├── routers/      # API Route Handlers
│       ├── models/       # Database Models
│       ├── schemas/      # Pydantic Schemas & DTOs
│       ├── services/     # Business Logic & External Integrations
│       ├── middleware/   # Custom FastAPI Middleware
│       ├── database/     # DB Connections & ORM Setup
│       ├── config/       # Environment Configuration
│       ├── utils/        # Helper Functions
│       └── main.py       # FastAPI Entrypoint & Health API
├── docs/                 # Documentation & Architecture Specifications
├── README.md             # Project Guide & Environment Setup
└── .gitignore            # Git Ignore Configuration
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: 3.12+

---

### 2. Backend Setup (FastAPI & Python 3.12)

#### Step 1: Navigate to the backend directory
```bash
cd backend
```

#### Step 2: Create a Python 3.12 Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**On Windows (Command Prompt - cmd):**
```cmd
python -m venv .venv
.\.venv\Scripts\activate.bat
```

**On macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Step 3: Install Backend Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 4: Run the Backend Server
```bash
uvicorn app.main:app --reload --port 8000
```
The FastAPI backend will start at `http://localhost:8000`.

---

### 3. Frontend Setup (Next.js 15)

#### Step 1: Navigate to the frontend directory
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Run Development Server
```bash
npm run dev
```
The Next.js frontend will start at `http://localhost:3000`.

---

## 📡 API Health Endpoint

| Method | Endpoint | Description | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint | `{"status": "Running"}` |

### Test Health Endpoint via cURL
```bash
curl http://localhost:8000/
```
Output:
```json
{
  "status": "Running"
}
```
