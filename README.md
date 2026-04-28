<p align="center">
  <img src="https://img.shields.io/badge/Vertex_AI-Gemini_1.5_Pro-34A853?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Docker-Cloud_Run-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<h1 align="center">💸 Artha — Your AI Personal CFO</h1>

<p align="center">
  <b>Artha</b> is an intelligent, AI-driven personal finance assistant that acts as your own <b>Chief Financial Officer</b>.<br/>
  It uses <b>Google Vertex AI (Gemini 1.5 Pro)</b> to analyze your real spending patterns and deliver<br/>
  hyper-personalized, actionable financial advice — not generic tips.
</p>

---

## 🚩 The Problem
Financial illiteracy and "spending blindness." Millions of young professionals and students struggle to manage their finances, not because they lack money, but because they lack **clarity**. Current expense trackers are passive—they just show you a list of numbers. They don't tell you *what* to do next or *how* your current spending pace will affect your end-of-month goals. This leads to anxiety, overspending, and missed savings targets.

## 💡 The Solution
**Artha** is an intelligent, AI-driven personal finance assistant that acts as your own **Chief Financial Officer**. Built for the Google Solution Challenge, Artha uses **Google Vertex AI (Gemini 1.5 Pro)** to analyze your real spending patterns and deliver hyper-personalized, actionable financial advice — not generic tips. Unlike traditional apps, Artha calculates your **Spend Velocity** in real-time, turning raw data into a clear financial roadmap.

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-security">Security</a>
</p>

---

## 🌟 Overview

Most personal finance apps tell you what you already know — "you spent too much on food." **Artha is different.**

Artha connects your actual transaction history to a large language model that understands **context, patterns, and priorities**. Instead of rule-based alerts, you get a real-time AI advisor that knows your spending velocity, tracks your financial goals, and delivers intelligent, two-sentence insights that are genuinely useful — the kind of advice you'd get from a personal CFO, not a budgeting app.

Built with a **cloud-native, production-grade stack**, Artha is designed from the ground up to be secure, scalable, and fast — with Firebase JWT authentication on every request, a Supabase-backed PostgreSQL database, and a FastAPI backend that feeds live data directly into Vertex AI.

---

## ✨ Features

### 🔐 Secure Google Sign-In
Firebase Authentication powers the login flow with full Google OAuth support. Every API call is protected by real JWT token validation on the backend via `firebase-admin` — no unauthenticated requests ever reach your data.

### 📊 Velocity Visualizer
A live Recharts graph plots your **cumulative monthly spending in real-time**, pulled directly from a cloud PostgreSQL database. The chart updates instantly whenever a new transaction is logged — giving you a clear visual picture of how fast your money is moving.

### 🧠 AI Personal CFO
The heart of Artha. On every dashboard load, your transaction history is segmented by category and fed into a **Gemini 1.5 Pro** prompt that generates two sentences of sharp, context-aware financial advice. No boilerplate — just insights grounded in *your* actual data.

### 📝 Transaction Logging
A sleek, dark-mode form lets you log expenses by **Amount, Date, Category, and Description**. Submissions are immediately persisted to the database and reflected in the velocity chart — zero page refresh needed.

### 🎯 Financial Goals
Set savings goals with a **target amount and deadline**. Goal data persists securely in Supabase PostgreSQL, and the AI advisor is aware of your goals when generating insights — so the advice is always aligned with what you're working toward.

### ☁️ Cloud-Native Architecture
Artha is built to run in production. The backend is containerized with Docker and deployable to **Google Cloud Run** in minutes. The frontend ships to **Firebase Hosting** with a single CLI command. Environment variables, CORS restrictions, and IAM-based Vertex AI access keep everything secure.

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

### How It Works — End to End

1. **User logs in** via Google OAuth through Firebase Authentication. A JWT token is issued and stored client-side.
2. **Dashboard loads** — the frontend sends the JWT to the FastAPI backend, which validates it via `firebase-admin`.
3. **Transaction data is fetched** from Supabase PostgreSQL using SQLAlchemy ORM, segmented by category and date.
4. **Math Engine** computes spend velocity — cumulative totals, category breakdowns, and goal progress.
5. **Vertex AI Advisor** receives a structured prompt containing the user's categorized spending and financial goals, and returns personalized insights via Gemini 1.5 Pro.
6. **Dashboard renders** — the Recharts velocity chart displays live cumulative data, and the InsightsFeed shows the AI-generated advice.
7. **New transactions** submitted via the form are written to the database and the chart re-renders automatically.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS | UI framework and build tooling |
| **Charts** | Recharts | Spending velocity visualization |
| **Backend** | Python, FastAPI, Uvicorn | REST API server |
| **Data Processing** | Pandas | Category aggregation and spend math |
| **AI Engine** | Google Vertex AI SDK, Gemini 1.5 Pro | Personalized financial advice |
| **Database** | PostgreSQL via Supabase | Persistent user, transaction, and goal data |
| **ORM** | SQLAlchemy | Database abstraction and migrations |
| **Auth** | Firebase Authentication (Google OAuth) | Secure login and JWT validation |
| **Deployment** | Google Cloud Run | Containerized backend hosting |
| **Hosting** | Firebase Hosting | Frontend CDN delivery |
| **Containerization** | Docker | Reproducible backend builds |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** and **npm**
- **Python 3.11+**
- A [Firebase Project](https://console.firebase.google.com/) with **Google Sign-In** enabled
- A [Supabase](https://supabase.com/) project — the free tier is sufficient
- A [Google Cloud Project](https://console.cloud.google.com/) with:
  - **Vertex AI API** enabled
  - A **Service Account** with the `Vertex AI User` role
  - A downloaded **Service Account JSON key**

---

### 1. Clone the Repository

```bash
git clone https://github.com/bsv1836/artha.git
cd artha
```

---

### 2. Initialize the Database

Run the schema initialization script against your Supabase PostgreSQL database:

```bash
psql postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres -f db/init.sql
```

This creates the `users`, `transactions`, and `financial_goals` tables in 3NF normalized form.

---

### 3. Backend Setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS / Linux

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory (copy from `.env.example`):

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
GOOGLE_APPLICATION_CREDENTIALS=./vertex-key.json
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
```

Place your GCP Service Account JSON as `backend/vertex-key.json`.

> ⚠️ Never commit `vertex-key.json` or `.env` to version control. Both are listed in `.gitignore` by default.

Start the backend server:

```bash
uvicorn main:app --reload
```

The API will be running at `http://localhost:8000`. You can explore the auto-generated API docs at `http://localhost:8000/docs`.

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## ☁️ Deployment

### Backend → Google Cloud Run

Build and push the Docker image, then deploy to Cloud Run:

```bash
cd backend

# Build and submit the image to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/artha-backend

# Deploy to Cloud Run
gcloud run deploy artha-backend \
  --image gcr.io/YOUR_PROJECT_ID/artha-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=your-db-url,GOOGLE_CLOUD_PROJECT=your-project-id
```

> For the Vertex AI credentials in Cloud Run, use **Workload Identity** or attach the service account directly to the Cloud Run service rather than uploading the JSON key file.

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

The frontend will be live at your Firebase Hosting URL (e.g., `https://your-project.web.app`). Update `VITE_API_BASE_URL` in your environment to point to the Cloud Run backend URL before building for production.

---

## 📁 Project Structure

```
artha/
├── backend/
│   ├── main.py                  # FastAPI app entry point — all API routes
│   ├── models.py                # SQLAlchemy ORM models (Users, Transactions, Goals)
│   ├── schemas.py               # Pydantic request/response validation schemas
│   ├── database.py              # SQLAlchemy engine, session factory, and Base
│   ├── Dockerfile               # Multi-stage Docker build for Cloud Run
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment variable template
│   └── services/
│       ├── advisor.py           # Vertex AI Gemini prompt engineering and response parsing
│       └── math_engine.py       # Spend velocity calculations and category aggregation
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root component — Firebase Auth gate and routing
│   │   ├── firebase.js          # Firebase app initialization
│   │   └── components/
│   │       ├── Dashboard.jsx         # Main layout — chart, insights, and navigation
│   │       ├── TransactionForm.jsx   # Expense logging form with live chart update
│   │       ├── GoalForm.jsx          # Financial goals creation form
│   │       └── InsightsFeed.jsx      # Vertex AI insights display component
│   ├── public/
│   ├── firebase.json            # Firebase Hosting config and rewrite rules
│   ├── vite.config.js           # Vite build configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── .env.example             # Frontend environment variable template
│   └── package.json
│
└── db/
    └── init.sql                 # PostgreSQL schema — 3NF normalized table definitions
```

---

## 🔌 API Reference

All endpoints require a valid Firebase JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Fetch all transactions for the authenticated user |
| `POST` | `/api/transactions` | Log a new expense transaction |
| `GET` | `/api/goals` | Fetch all financial goals for the authenticated user |
| `POST` | `/api/goals` | Create a new financial goal |
| `GET` | `/api/insights` | Trigger Vertex AI analysis and return personalized advice |

Full interactive documentation is available at `/docs` (Swagger UI) and `/redoc` when the backend is running.

---

## 🔒 Security

- **JWT Validation** — Every API route validates the Firebase JWT token server-side using the `firebase-admin` SDK. Unauthenticated requests receive a `401 Unauthorized` response.
- **Secret Management** — All credentials (database URL, GCP project ID, Firebase config) are stored exclusively in `.env` files and are never committed to version control.
- **CORS Policy** — CORS is configured to allow only specific origins in production. The development configuration allows `localhost` only.
- **Vertex AI Access** — The backend communicates with Vertex AI using a GCP Service Account with the minimum required `Vertex AI User` role. The credentials file is excluded from the Docker image in production deployments using Workload Identity instead.
- **Database Isolation** — Each user's data is scoped by their Firebase UID, which is stored and enforced at the database query level — users can never access each other's transactions or goals.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Make your changes and commit (`git commit -m 'Add some feature'`)
4. Push to your branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

Please make sure your changes don't break existing functionality and follow the existing code style.

---

<p align="center">Built with ❤️ using Google Cloud &nbsp;|&nbsp; Firebase &nbsp;|&nbsp; Vertex AI &nbsp;|&nbsp; Supabase</p>
