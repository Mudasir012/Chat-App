import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send, Sparkles } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute bottom-[-10%] left-[-5%] size-[500px] bg-[var(--secondary-accent)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4 relative z-10">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12 text-center lg:text-left">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary-bg)] border border-[var(--border)] text-xs font-semibold text-[var(--accent)]"
                >
                  <Sparkles className="size-3.5" />
                  <span>Get in touch</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-6xl md:text-7xl font-bold tracking-tight leading-none"
                >
                  Say Hello
                </motion.h1>
                <p className="text-lg text-[var(--text-muted)] max-w-md mx-auto lg:mx-0">
                  Have questions or just want to chat? We'd love to hear from you. Our team is always here to help.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-8">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="size-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-sm">
                    <Mail className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Email us at</p>
                    <p className="text-lg font-bold hover:text-[var(--accent)] transition-colors cursor-pointer">hello@chatapp.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="size-12 rounded-2xl bg-[var(--secondary-accent)]/10 flex items-center justify-center text-[var(--secondary-accent)] shadow-sm">
                    <Send className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Follow us</p>
                    <p className="text-lg font-bold hover:text-[var(--secondary-accent)] transition-colors cursor-pointer">@chatapp_hq</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="size-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)] shadow-sm">
                    <MapPin className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Visit us</p>
                    <p className="text-sm font-semibold">123 Minimalist St. San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-10 card-curvy shadow-2xl shadow-black/5 space-y-8"
            >
              <h2 className="text-2xl font-bold tracking-tight">Drop us a line</h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1 text-[var(--text-muted)]">Full Name</label>
                  <input type="text" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1 text-[var(--text-muted)]">Email Address</label>
                  <input type="email" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1 text-[var(--text-muted)]">Your Message</label>
                  <textarea className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm min-h-[120px]" placeholder="What's on your mind?" />
                </div>
                <button className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 group">
                  Send Message
                  <Send className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

