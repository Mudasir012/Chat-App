import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const { signup, isSigningUp } = useAuthStore()

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-10 border-2 border-[var(--border)] space-y-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Sign Up</h1>
            <p className="text-xs font-mono uppercase tracking-widest opacity-50">Join the ChatApp Community</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-2 border-[var(--border)] p-3 focus:outline-none focus:bg-[var(--text)] focus:text-[var(--bg)] transition-all font-mono text-sm uppercase" 
                placeholder="JOHN DOE"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Email</label>
              <input 
                type="email" 
                className="w-full bg-transparent border-2 border-[var(--border)] p-3 focus:outline-none focus:bg-[var(--text)] focus:text-[var(--bg)] transition-all font-mono text-sm" 
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                className="w-full bg-transparent border-2 border-[var(--border)] p-3 focus:outline-none focus:bg-[var(--text)] focus:text-[var(--bg)] transition-all font-mono text-sm" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSigningUp}
              className="w-full py-4 bg-[var(--text)] text-[var(--bg)] font-bold uppercase tracking-widest hover:bg-[var(--bg)] hover:text-[var(--text)] border-2 border-[var(--border)] transition-all flex items-center justify-center gap-2"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t-2 border-[var(--border)]">
            <p className="text-xs font-bold uppercase">
              Already have an account? <Link to="/signin" className="underline hover:no-underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

