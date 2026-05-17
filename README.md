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

## Security Model

This platform serves minors — every layer applies defence-in-depth.

### Student Code Sandbox

Student JavaScript runs exclusively inside a hidden `<iframe>` with:

```html
<iframe sandbox="allow-scripts" srcdoc="...">
```

**Why no `allow-same-origin`?** Without it the sandboxed page runs in a null origin. It cannot read cookies, `localStorage`, IndexedDB, or Firebase tokens from the parent domain — even if the student writes malicious code. This is the single most important sandbox flag.

**Communication** — the iframe sends results back via `postMessage`. The parent validates every incoming message:

1. `ev.source` must be the exact iframe `contentWindow`
2. `ev.data.runId` must match the randomly-generated ID issued for the current run

Stale or spoofed messages are silently dropped.

**Infinite-loop protection** — the parent starts a 10-second timer when code is executed. If no `script-done` acknowledgement arrives in time, the iframe is destroyed and the student sees _"Код работал слишком долго — возможно, бесконечный цикл"_.

**`srcdoc`, not `src`** — student HTML is set via `iframe.srcdoc`, never as a navigable URL, so the frame never acquires a real origin.

**`</script>` / `</style>` escaping** — user code is sanitised with a targeted string replacement before insertion into the `srcdoc` template, preventing premature tag closure.

**Content-Security-Policy** — each sandbox document includes a `<meta>` CSP that blocks all outbound network requests (`connect-src 'none'`), disallows external scripts, and restricts image sources to `data:` URIs and `blob:` URLs.

### XSS Protection

All dynamic lesson HTML (fetched from Firestore) is passed through [DOMPurify](https://github.com/cure53/DOMPurify) before rendering:

```typescript
DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ['h1','h2',…,'table','img',…],
  ALLOWED_ATTR: ['href','src','alt','class','target','rel',…],
})
```

`<script>`, inline event handlers (`onerror`, `onclick`, …), and `javascript:` URIs are stripped. The allowlist covers only the semantic HTML needed for lesson content.

External links in lesson content should include `rel="noopener noreferrer"` to prevent tab-napping and referrer leakage.

### Firestore Security Rules

Rules are enforced server-side — the client app cannot bypass them.

| Collection | Student | Teacher | Admin / Owner |
|---|---|---|---|
| `userRoles` | Read own · update displayName only | — | Full control |
| `users/{uid}` | Read / write own | — | — |
| `dynamicLessons` | Read **published** only (query enforced) | Read all | Full control |
| `assignments` | Read **published** only (query enforced) | Create / manage own | Full control |
| `submissions` | Create own · read own only | Read / grade all | Full control |
| `classGroups` | Read / list joined classes | Create / manage own | Full control |
| `teacherProfiles` | — | Read / write own token | Read (audit only) |

**Key protections:**

- A student's self-registration is locked to `role: 'student'`; only whitelisted fields are accepted. No client can elevate its own role.
- On submission `create`, the fields `manualScore`, `gradedBy`, and `feedback` are forbidden — they can only be added by a teacher via `update`.
- On submission `update` by a teacher, only the four grading fields (`manualScore`, `feedback`, `gradedBy`, `gradedAt`) may change; student answers and `userId` are immutable.
- Submission list queries are scoped: students may only run queries filtered to their own `userId`; unfiltered scans are rejected at the rule level.
- Dynamic lessons and assignments: students may only list/query with a `published == true` filter; unfiltered queries are rejected.
- Class enumeration: unauthenticated users may look up a specific class by ID (for invite links) but cannot list all classes.

### Storage Rules

| Path | Read | Write |
|---|---|---|
| `lessons/{id}/images/*` | Authenticated users | **Teachers + Admins only** |
| `users/{uid}/avatar/*` | Authenticated users | Owner only |
| Everything else | ❌ | ❌ |

Uploads are restricted to `image/jpeg`, `image/png`, `image/gif`, `image/webp`. Size limits: 5 MB for lesson images, 2 MB for avatars. SVG is excluded to eliminate the risk of embedded script execution.

### Environment Variables

Firebase credentials live in `.env.local` (never committed). `.gitignore` excludes all `.env*` files except `.env.example`. The example file documents every required variable without containing real values.

## License

MIT
