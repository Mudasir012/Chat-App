import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && !agreedToTerms) {
      return toast.error("Please agree to the Terms & Conditions");
    }

    if (!isLogin) {
      const result = await signup(formData);
      if (result?.success) {
        navigate("/verify-email");
      }
    } else {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if (result?.needsVerification) {
        navigate("/verify-email");
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: "", email: "", password: "" });
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl h-[85vh] md:h-[700px] bg-[var(--secondary-bg)] rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--border)] flex flex-col md:flex-row"
      >
        {/* Left Panel - Branding */}
        <div className="relative w-full md:w-1/2 bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-8 flex flex-col justify-between overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--accent)]/10 to-transparent" />
          </div>

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight font-display">
              Plavox
            </span>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-4 py-2 rounded-full bg-[var(--bg)]/50 border border-[var(--border)]"
            >
              Back to website
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Bottom content */}
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {isLogin ? "Welcome back to" : "Start your journey with"}
              <br />
              <span className="text-[var(--accent)]">Plavox</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm max-w-xs">
              {isLogin
                ? "Sign in to continue your conversations and stay connected."
                : "Connect with friends, share moments, and chat in real-time."}
            </p>

            {/* Pagination dots */}
            <div className="flex gap-2 pt-4">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  isLogin ? "w-8 bg-[var(--accent)]" : "w-3 bg-[var(--surface)]"
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  !isLogin ? "w-8 bg-[var(--accent)]" : "w-3 bg-[var(--surface)]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {isLogin ? "Sign in" : "Create an account"}
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="text-[var(--accent)] font-semibold hover:underline transition-colors"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms checkbox (signup only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 pt-1"
                  >
                    <button
                      type="button"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`size-5 rounded flex items-center justify-center border transition-all ${
                        agreedToTerms
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--bg)]"
                      }`}
                    >
                      {agreedToTerms && (
                        <Check className="size-3 text-[var(--accent-content)]" />
                      )}
                    </button>
                    <span className="text-xs text-[var(--text-muted)]">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-[var(--accent)] hover:underline"
                      >
                        Terms & Conditions
                      </Link>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoggingIn || isSigningUp}
                className="btn-primary w-full py-3.5 mt-6 flex items-center justify-center gap-2 text-sm"
              >
                {isLoggingIn || isSigningUp ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* Forgot password link */}
            {isLogin && (
              <div className="text-center mt-4">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
