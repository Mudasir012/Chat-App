import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Users, Code, Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] size-[500px] bg-[var(--accent)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4 relative z-10">
        <div className="container max-w-5xl space-y-24">
          <section className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary-bg)] border border-[var(--border)] text-xs font-semibold text-[var(--accent)]"
            >
              <Sparkles className="size-3.5" />
              <span>About Plavox</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-bold tracking-tight leading-none"
            >
              Our Mission
            </motion.h1>
            
            <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-2xl leading-relaxed">
              We believe communication should be <span className="text-[var(--text)] font-semibold">simple</span>, <span className="text-[var(--text)] font-semibold">secure</span>, and <span className="text-[var(--text)] font-semibold">beautiful</span>. 
              Our platform is built for those who value focus and transparency.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-12 pt-12 border-t border-[var(--border)]">
            <div className="space-y-6">
              <div className="size-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <Users className="size-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">The Team</h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Founded by a group of designers and developers who were tired of cluttered interfaces 
                and privacy concerns. We built the tool we actually wanted to use every day.
              </p>
            </div>
            <div className="space-y-6">
              <div className="size-12 rounded-2xl bg-[var(--secondary-accent)]/10 flex items-center justify-center text-[var(--secondary-accent)]">
                <Code className="size-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">The Tech</h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Leveraging the latest in end-to-end encryption and real-time synchronization to ensure 
                your data is yours alone, delivered with zero latency.
              </p>
            </div>
          </section>

          <section className="p-10 md:p-16 rounded-[3rem] bg-[var(--secondary-bg)] text-[var(--text)] relative overflow-hidden shadow-2xl group border border-[var(--border)]">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <Zap className="size-32" />
            </div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl font-bold tracking-tight">Ready to join the revolution?</h2>
              <p className="max-w-xl text-[var(--text-muted)] text-lg leading-relaxed">
                Start chatting with a platform that respects your time and your data. 
                No ads, no tracking, just pure connection.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/signup" className="px-8 py-3 bg-[var(--accent)] text-[#212529] font-bold rounded-full hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-black/30">
                  Get Started for Free
                </Link>
                <Link to="/contact" className="px-8 py-3 bg-white/5 text-[var(--text)] font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm border border-[var(--border)]">
                  Contact Support
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

