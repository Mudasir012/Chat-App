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
      <div className="grid-bg" />
      <div className="orb w-[500px] h-[500px] bg-[var(--orb-1)] top-[-200px] right-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-[var(--orb-2)] bottom-0 left-[-100px]" />

      <Navbar />
      <main className="flex-1 w-full flex items-center justify-center py-20 px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-md p-8 md:p-12 card-curvy shadow-2xl shadow-black/10"
        >
          <div className="space-y-3 text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="size-16 bg-gradient-to-br from-[var(--accent)] to-[var(--secondary-accent)] rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-black/20 mb-6"
            >
              <UserPlus className="size-8" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-sm text-[var(--text-muted)]">Join the community today</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold ml-1 flex items-center gap-2 text-[var(--text-muted)] uppercase tracking-wider">
                <User className="size-3.5" />
                Full Name
              </label>
              <input 
                type="text" 
                className="input-base" 
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold ml-1 flex items-center gap-2 text-[var(--text-muted)] uppercase tracking-wider">
                <Mail className="size-3.5" />
                Email
              </label>
              <input 
                type="email" 
                className="input-base" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold ml-1 flex items-center gap-2 text-[var(--text-muted)] uppercase tracking-wider">
                <Lock className="size-3.5" />
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="input-base pr-11" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSigningUp}
              className="btn-primary w-full py-4 text-base mt-2 flex items-center justify-center gap-2"
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
              Already have an account?{" "}
              <Link to="/signin" className="text-[var(--accent)] font-semibold hover:underline underline-offset-4 transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}


