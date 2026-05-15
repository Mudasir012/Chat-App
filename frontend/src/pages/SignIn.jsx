import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result?.needsVerification) {
      navigate("/verify-email");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[5%] size-64 bg-[var(--accent)] opacity-[0.05] blur-3xl rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] size-96 bg-[var(--secondary-accent)] opacity-[0.05] blur-3xl rounded-full" />
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
              <LogIn className="size-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-[var(--text-muted)]">Sign in to your ChatApp account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="text-right">
                <Link to="/forgot-password" size="sm" className="text-sm text-[var(--accent)] font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full py-4 text-base mt-4 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center mt-10 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)]">
              New here? <Link to="/signup" className="text-[var(--accent)] font-semibold hover:underline decoration-2 underline-offset-4">Create an account</Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}


