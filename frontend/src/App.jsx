import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/landingpage.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
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

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
        <Loader className="size-10 animate-spin text-[var(--accent)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-x-hidden">
      {/* Global Background Elements */}
      <div className="grid-bg" />
      <div className="orb w-[500px] h-[500px] bg-[rgba(173,181,189,0.08)] top-[-200px] right-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-[rgba(108,117,125,0.06)] bottom-0 left-[-100px]" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Router>
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={!authUser ? <SignIn /> : <Navigate to="/" />} />
            <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/verify-email" element={!authUser ? <VerifyEmail /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={!authUser ? <ForgotPassword /> : <Navigate to="/" />} />
            <Route path="/reset-password/:token" element={!authUser ? <ResetPassword /> : <Navigate to="/" />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/signin" />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Toaster position="bottom-right" reverseOrder={false} />
          <CallOverlay />
        </Router>
      </div>
    </div>
  )
}


export default App
