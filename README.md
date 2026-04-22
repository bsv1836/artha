<p align="center">
  <img src="https://img.shields.io/badge/Google_Solution_Challenge-2024-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Vertex_AI-Gemini_1.5_Pro-34A853?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
</p>

<h1 align="center">💸 Artha — Your AI Personal CFO</h1>

<p align="center">
  <b>Artha</b> is an intelligent, AI-driven personal finance assistant that acts as your own <b>Chief Financial Officer</b>. Built for the Google Solution Challenge, Artha uses Google Vertex AI (Gemini 1.5 Pro) to analyze your real spending patterns and deliver hyper-personalized, actionable financial advice — not generic tips.
</p>

---

## ✨ Features

- **🔐 Secure Google Sign-In** — Firebase Authentication with real JWT token validation on every API call.
- **📊 Velocity Visualizer** — A live Recharts graph plotting your cumulative monthly spending in real-time, pulled directly from a cloud PostgreSQL database.
- **🧠 AI Personal CFO** — Google Vertex AI (Gemini 1.5 Pro) analyzes your actual spending by category and delivers two sentences of sharp, personalized advice each time you open the dashboard.
- **📝 Transaction Logging** — A sleek, dark-mode form to log expenses by Amount, Date, Category, and Description. The chart updates the moment you submit.
- **🎯 Financial Goals** — Set savings goals with a target amount and deadline. Data persists securely in Supabase PostgreSQL.
- **☁️ Cloud-Native Architecture** — Designed for deployment on Google Cloud Run (backend) and Firebase Hosting (frontend).

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│  Firebase Auth → Dashboard → TransactionForm → GoalForm         │
│  Recharts Velocity Visualizer ← Real-time DB Data               │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS + Firebase JWT
┌────────────────────────────▼────────────────────────────────────┐
│                   BACKEND (FastAPI + Python)                     │
│  JWT Middleware → Math Engine → Vertex AI Advisor               │
│  /api/insights  /api/transactions  /api/goals                   │
└───────────┬───────────────────────────────┬────────────────────┘
            │ SQLAlchemy ORM                │ Vertex AI SDK
┌───────────▼──────────┐       ┌────────────▼────────────────────┐
│  PostgreSQL (Supabase)│       │  Google Vertex AI (Gemini 1.5)  │
│  Users / Transactions │       │  Category-aware CFO Prompt      │
│  / Financial Goals    │       │  Hyper-personalized Advice      │
└──────────────────────┘       └─────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts |
| **Backend** | Python, FastAPI, Uvicorn, Pandas |
| **AI Engine** | Google Vertex AI SDK, Gemini 1.5 Pro |
| **Database** | PostgreSQL via Supabase, SQLAlchemy ORM |
| **Auth** | Firebase Authentication (Google OAuth) |
| **Deployment** | Google Cloud Run, Firebase Hosting, Docker |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- A [Firebase Project](https://console.firebase.google.com/) with Google Sign-In enabled
- A [Supabase](https://supabase.com/) project (free tier works)
- A [Google Cloud Project](https://console.cloud.google.com/) with Vertex AI API enabled and a Service Account JSON key

---

### 1. Clone the Repository

```bash
git clone https://github.com/bsv1836/artha.git
cd artha
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory (copy from `.env.example`):

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
GOOGLE_APPLICATION_CREDENTIALS=./vertex-key.json
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
```

Place your GCP Service Account JSON as `backend/vertex-key.json`.

Start the backend:
```bash
uvicorn main:app --reload
```

The API will be running at `http://localhost:8000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

Start the frontend:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## ☁️ Deployment

### Backend → Google Cloud Run

```bash
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/artha-backend
gcloud run deploy artha-backend \
  --image gcr.io/YOUR_PROJECT_ID/artha-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=...,GOOGLE_CLOUD_PROJECT=...
```

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

---

## 📁 Project Structure

```
artha/
├── backend/
│   ├── main.py              # FastAPI app, all API routes
│   ├── models.py            # SQLAlchemy ORM models (Users, Transactions, Goals)
│   ├── schemas.py           # Pydantic validation schemas
│   ├── database.py          # SQLAlchemy engine & session
│   ├── Dockerfile           # For Cloud Run deployment
│   ├── requirements.txt
│   └── services/
│       ├── advisor.py       # Vertex AI Gemini prompt engine
│       └── math_engine.py   # Spend/Savings velocity calculations
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Root app with Firebase Auth gate
│   │   └── components/
│   │       ├── Dashboard.jsx        # Main layout, live chart
│   │       ├── TransactionForm.jsx  # Expense logging form
│   │       ├── GoalForm.jsx         # Financial goals form
│   │       └── InsightsFeed.jsx     # Vertex AI insights display
│   ├── firebase.json        # Firebase Hosting config
│   └── package.json
└── db/
    └── init.sql             # PostgreSQL schema (3NF normalized)
```

---

## 🔒 Security

- All API routes are protected by Firebase JWT token validation via `firebase-admin`.
- Database credentials and API keys are stored exclusively in `.env` files (never committed to git).
- CORS is configured to restrict origins in production.

---

## 🤝 Contributing

This project was built for the **Google Solution Challenge**. Contributions, issues, and feature requests are welcome!

---

<p align="center">Built with ❤️ using Google Cloud | Firebase | Vertex AI</p>
