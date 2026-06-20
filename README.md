# 🚀 CHAT APP

A high-impact, real-time messaging platform built with the MERN stack, featuring a bold neo-brutalist aesthetic, secure authentication, and multimedia support.

![ChatApp Landing Page](./frontend/src/assets/hero-screenshot.png) *(Note: Add your actual screenshot here)*

## ✨ FEATURES

- **Real-Time Messaging**: Instant communication powered by Socket.io.
- **Neo-Brutalist UI**: High-contrast, bold typography, and thick-bordered design.
- **Full Authentication**: Secure signup/login using JWT and HTTP-only cookies.
- **Multimedia Sharing**: Upload and send images effortlessly via Cloudinary.
- **Live Online Status**: Real-time tracking of online/offline users.
- **Theme-Aware**: Seamless switching between Dark and Light modes.
- **Profile Management**: Customizable user profiles with avatar uploads.
- **Automated Emails**: Styled welcome emails sent via Nodemailer.

## 🛠️ TECH STACK

**Frontend:**
- React.js
- Tailwind CSS
- Framer Motion (Animations)
- Zustand (State Management)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- Socket.io (Real-time)
- Cloudinary (Media Storage)
- Nodemailer (Email Service)
- JWT (Security)

## 📦 INSTALLATION

### 1. Clone the Repository
```bash
git clone https://github.com/Mudasir012/chat-app.git
cd chat-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Copy the example environment file and fill in your real credentials:
```bash
cp backend/.env.example backend/.env
```

Never commit `.env` files to Git. Rotate all secrets before deploying.

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env
npm install
```

## 🚀 RUNNING THE APP

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The app will be running at `http://localhost:5173`.

## 📂 PROJECT STRUCTURE

```text
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── lib/            # Utilities (DB, Socket, Mail)
│   │   ├── middleware/     # Auth & Error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── index.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Full pages
│   │   ├── store/          # Zustand stores
│   │   └── lib/            # Axios config
```

## 🚀 Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for step-by-step instructions on deploying both the frontend and backend to Vercel, including required environment variables.

## 📄 LICENSE

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ⚡ by [Your Name]
