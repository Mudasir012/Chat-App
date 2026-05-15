import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Loader2, Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const { signup, isSigningUp } = useAuthStore()

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      const result = await signup(formData);
      if (result?.success) {
        navigate("/verify-email");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[5%] right-[5%] size-64 bg-[var(--accent)] opacity-[0.05] blur-3xl rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] size-96 bg-[var(--secondary-accent)] opacity-[0.05] blur-3xl rounded-full" />
      </div>

      <Navbar />
      <main className="flex-1 w-full flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 md:p-12 card-curvy shadow-xl shadow-black/5"
        >
          <div className="space-y-3 text-center mb-10">
            <div className="size-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-[#212529] mx-auto shadow-lg shadow-black/20 mb-6">
              <UserPlus className="size-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-sm text-[var(--text-muted)]">Join the ChatApp community today</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center gap-2 text-[var(--text-muted)]">
                <User className="size-4" />
                Full Name
              </label>
              <input 
                type="text" 
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm" 
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center gap-2 text-[var(--text-muted)]">
                <Mail className="size-4" />
                Email
              </label>
              <input 
                type="email" 
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center gap-2 text-[var(--text-muted)]">
                <Lock className="size-4" />
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 pr-11 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSigningUp}
              className="btn-primary w-full py-4 text-base mt-4 flex items-center justify-center gap-2"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-10 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)]">
              Already have an account? <Link to="/signin" className="text-[var(--accent)] font-semibold hover:underline decoration-2 underline-offset-4">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}


