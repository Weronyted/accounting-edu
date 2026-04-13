# AccountingEdu — Interactive Accounting Education Platform

A full-stack accounting education website built with React 18, TypeScript, Tailwind CSS, and Firebase.

## Features

- **8 interactive lessons** covering core accounting topics
- **Exam-style quizzes** — transaction tables and account classification
- **3 languages** — English, Russian, Uzbek (i18next)
- **Firebase Auth** — Google Sign-In + Email/Password
- **Progress tracking** — localStorage (guest) + Firestore (signed in)
- **Dark/Light theme** with persistence
- **Global search** (Ctrl+K) with Fuse.js fuzzy matching
- **Keyboard shortcuts** — T (theme), L (language), Arrows (navigate lessons)
- **Framer Motion** page transitions and animations
- **Recharts** radar chart on Dashboard
- **Formula Drawer** — floating reference for all key formulas
- **Interactive T-Account widget**
- **Print-ready** lesson pages (CSS @media print)
- **Docker + nginx** deployment on Railway

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 + Framer Motion v11 |
| Routing | React Router v6 |
| i18n | i18next + react-i18next |
| Icons | Lucide React |
| Charts | Recharts |
| State | Zustand (with persist middleware) |
| Auth/DB | Firebase v10 (Auth + Firestore) |
| Search | Fuse.js |
| Deployment | Railway (Dockerfile + nginx) |

## Project Structure

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, PageTransition
│   ├── ui/           # Button, Card, Badge, Modal, Drawer, Tooltip, GlobalSearch
│   ├── quiz/         # QuizResult, TransactionTable, ClassifyTable
│   ├── diagrams/     # TAccountSVG, BalanceSheetSVG, EquationDiagram
│   ├── lesson/       # LessonProgress, KeyTermBox, DidYouKnow, FormulaDrawer
│   └── auth/         # AuthModal, UserAvatar, SignInPrompt
├── pages/
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── LessonPage.tsx
│   ├── Glossary.tsx
│   ├── Profile.tsx
│   └── NotFound.tsx
├── lessons/          # Lesson content as TypeScript objects
├── i18n/             # EN / RU / UZ translation JSON files
├── store/            # Zustand stores (theme, language, progress, auth)
├── services/         # Firebase init, auth service, progress service
├── hooks/            # useAuth, useProgress, useKeyboard
└── utils/            # cn, readingTime, formatScore
```

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd accounting-education
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Sign-in methods: Google + Email/Password
4. Create a **Firestore Database** (start in production mode)
5. Copy your Firebase config values

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Firestore Security Rules

In the Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment on Railway

### 1. Build Docker Image

The project includes a `Dockerfile` for multi-stage build (Node → nginx).

### 2. Deploy on Railway

1. Create a new Railway project
2. Connect your Git repository
3. Railway auto-detects the `Dockerfile`
4. Add environment variables in the Railway dashboard (all `VITE_FIREBASE_*` values)
5. Deploy — Railway uses `railway.toml` config

### 3. Environment Variables on Railway

Set these in Railway Dashboard → Variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open global search |
| `T` | Toggle dark/light theme |
| `L` | Cycle language (EN → RU → UZ) |
| `→` | Next lesson (when on lesson page) |
| `←` | Previous lesson (when on lesson page) |
| `Esc` | Close modals/drawers |

## Available Lessons

1. Introduction to Accounting
2. Double-Entry Bookkeeping
3. Account Classification
4. Financial Statements
5. Trade Receivables & Payables
6. Inventory & COGS
7. Bank Reconciliation
8. Payroll & Salaries

## License

MIT
