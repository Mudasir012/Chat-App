# 🚀 BRUTALIST CHAT APP

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
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
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

## 📄 LICENSE

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ⚡ by [Your Name]
