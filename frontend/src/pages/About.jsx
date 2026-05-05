import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4">
        <div className="container max-w-5xl space-y-20">
          <section className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl font-black tracking-tighter uppercase leading-none"
            >
              Our<br/>Mission
            </motion.h1>
            <p className="text-xl font-medium border-l-4 border-[var(--border)] pl-6 max-w-2xl">
              We believe communication should be simple, secure, and beautiful. 
              Our platform is built for those who value focus and transparency.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-12 border-t-2 border-[var(--border)] pt-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight">The Team</h2>
              <p className="text-sm leading-relaxed opacity-70">
                Founded by a group of designers and developers who were tired of cluttered interfaces 
                and privacy concerns. We built the tool we wanted to use.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight">The Tech</h2>
              <p className="text-sm leading-relaxed opacity-70">
                Leveraging the latest in encryption and real-time synchronization to ensure 
                your data is yours alone, delivered instantly.
              </p>
            </div>
          </section>

          <section className="p-12 border-2 border-[var(--border)] bg-[var(--text)] text-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-all group">
            <h2 className="text-3xl font-black uppercase mb-6 group-hover:line-through">Join the Revolution</h2>
            <p className="max-w-xl mb-8 opacity-80 group-hover:opacity-100">
              Start chatting with a platform that respects your time and your data. 
              No ads, no tracking, just conversation.
            </p>
            <button className="px-8 py-3 bg-[var(--bg)] text-[var(--text)] font-bold uppercase border-2 border-[var(--bg)] group-hover:border-[var(--border)] group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition-all">
              Sign Up Now
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
