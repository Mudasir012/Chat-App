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
              <LogIn className="size-8" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-[var(--text-muted)]">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-[var(--accent)] font-semibold hover:underline underline-offset-2">
                  Forgot password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full py-4 text-base mt-2 flex items-center justify-center gap-2"
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
              New here?{" "}
              <Link to="/signup" className="text-[var(--accent)] font-semibold hover:underline underline-offset-4 transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}


