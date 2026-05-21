import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import LandingPage from './pages/landingpage.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Settings from './pages/Settings.jsx'
import CallOverlay from './components/CallOverlay.jsx'
import './App.css'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();
  const { authUser } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage>{authUser ? <HomePage /> : <LandingPage />}</AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
        <Route path="/auth" element={!authUser ? <AnimatedPage><AuthPage /></AnimatedPage> : <Navigate to="/" />} />
        <Route path="/signin" element={<Navigate to="/auth" />} />
        <Route path="/signup" element={<Navigate to="/auth" />} />
        <Route path="/verify-email" element={!authUser ? <AnimatedPage><VerifyEmail /></AnimatedPage> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!authUser ? <AnimatedPage><ForgotPassword /></AnimatedPage> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={!authUser ? <AnimatedPage><ResetPassword /></AnimatedPage> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <AnimatedPage><ProfilePage /></AnimatedPage> : <Navigate to="/signin" />} />
        <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
        <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
        <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()

  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleOnline = () => {
      toast.success("Back online", { duration: 3000, icon: "🌐" });
      setWasOffline(false);
    };
    const handleOffline = () => {
      toast.error("You're offline. Some features may be unavailable.", { duration: 5000, icon: "⚠️" });
      setWasOffline(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
        <Loader className="size-10 animate-spin text-[var(--accent)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-x-hidden">
      <div className="grid-bg" />
      <div className="orb w-[500px] h-[500px] bg-[var(--orb-1)] top-[-200px] right-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-[var(--orb-2)] bottom-0 left-[-100px]" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Router>
          <AppRoutes />
          <Toaster position="bottom-right" reverseOrder={false} />
          <CallOverlay />
        </Router>
      </div>
    </div>
  )
}


export default App
