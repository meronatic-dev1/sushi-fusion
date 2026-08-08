# Sushi Fusion Monorepo

Welcome to the **Sushi Fusion** application! This repository is organized into a clean twin-folder architecture:

```
sushi-fusion/
├── frontend/     # Next.js 16 Frontend Web Application
├── backend/      # NestJS API & Database Backend Service
└── package.json  # Root helper scripts
```

---

## 🚀 Quick Start

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```

### 2. Environment Setup
- Copy `frontend/.env.example` to `frontend/.env.local`
- Copy `backend/.env.example` to `backend/.env`

### 3. Run Development Servers

**Frontend (Next.js - Port 3000):**
```bash
npm run dev:frontend
```

**Backend (NestJS - Port 3001):**
```bash
npm run dev:backend
```

---

## 🛠️ Building for Production

To build both the frontend and backend:
```bash
npm run build
```

Individual builds:
```bash
npm run build:frontend
npm run build:backend
```
