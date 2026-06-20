# Deployment Guide

This project is split into two Vercel projects:

| Project | Folder | Vercel project name |
|---|---|---|
| Frontend | `/` | `chat-app` |
| Backend | `/backend` | `plavox-api` |

The frontend is a Vite + React SPA. The backend is an Express API deployed as Vercel serverless functions.

---

## 1. Required Vercel environment variables

### Frontend (`chat-app`)

In the Vercel dashboard for the frontend project, add:

```env
VITE_BACKEND_URL=https://<your-backend-domain>.vercel.app
VITE_ZEGO_APP_ID=your_zego_app_id
VITE_PUSHER_KEY=your_pusher_key
VITE_PUSHER_CLUSTER=your_pusher_cluster
```

- `VITE_BACKEND_URL` must point to the backend deployment **without** `/api` at the end.
- These values are baked into the build, so you must redeploy after changing them.

### Backend (`plavox-api`)

In the Vercel dashboard for the backend project, add:

```env
NODE_ENV=production
FRONTEND_URL=https://<your-frontend-domain>.vercel.app
CLIENT_URL=https://<your-frontend-domain>.vercel.app

MONGODB_URI=mongodb+srv://user:pass@host/chatapp?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

MAIL_USER=...
MAIL_PASS=...

PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...

ZEGO_APP_ID=...
ZEGO_SERVER_SECRET=...
```

- `FRONTEND_URL` and `CLIENT_URL` must match your deployed frontend URL so CORS and cookies work.
- `MONGODB_URI` should include the database name (e.g. `/chatapp`).
- All secrets should be rotated and never committed to Git. Use the `.env.example` files as a template for local development only.

---

## 2. GitHub Actions secrets

Add the following secrets to your GitHub repository:

- `VERCEL_ORG_ID` — your Vercel team/org ID.
- `VERCEL_PROJECT_ID` — project ID for the **frontend** (`chat-app`).
- `VERCEL_BACKEND_PROJECT_ID` — project ID for the **backend** (`plavox-api`).
- `VERCEL_TOKEN` — Vercel access token.

The repository contains two workflows:

- `.github/workflows/ci-cd.yml` — deploys the frontend.
- `.github/workflows/deploy-backend.yml` — deploys the backend when files under `backend/` change.

---

## 3. Local development

1. Copy the example env files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Fill in your real values.
3. Start the backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 4. Common deployment issues

| Symptom | Cause | Fix |
|---|---|---|
| Users list never loads / all API calls fail | `VITE_BACKEND_URL` missing or still set to `localhost` | Set the correct backend URL in the frontend Vercel dashboard and redeploy. |
| CORS errors in the browser | `FRONTEND_URL` not set on the backend | Add `FRONTEND_URL` to the backend Vercel dashboard. |
| Auth works locally but not live | Cookies blocked cross-origin | Ensure the backend cookie uses `sameSite: none` + `secure: true` in production (already configured) and CORS allows credentials. |
| Call button does nothing | Missing Zego env vars | Set `ZEGO_APP_ID` and `ZEGO_SERVER_SECRET` on the backend and `VITE_ZEGO_APP_ID` on the frontend. |
| Cannot create rooms in groups | ObjectId comparison bug | Fixed in `Sidebar.jsx` and `BoardContainer.jsx`. |
