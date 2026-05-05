import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-7xl font-black tracking-tighter uppercase leading-none"
              >
                Say<br/>Hello
              </motion.h1>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Email</h3>
                  <p className="text-xl font-bold border-b-2 border-[var(--border)] inline-block hover:bg-[var(--text)] hover:text-[var(--bg)] transition-all">hello@chatapp.com</p>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Twitter</h3>
                  <p className="text-xl font-bold border-b-2 border-[var(--border)] inline-block hover:bg-[var(--text)] hover:text-[var(--bg)] transition-all">@chatapp_hq</p>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Office</h3>
                  <p className="text-sm font-medium">123 Minimalist St.<br/>Design District, 94103</p>
                </div>
              </div>
            </div>

            <div className="p-8 border-2 border-[var(--border)] space-y-8 bg-[var(--bg)]">
              <h2 className="text-2xl font-black uppercase tracking-tight">Drop us a line</h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Name</label>
                  <input type="text" className="w-full bg-transparent border-b-2 border-[var(--border)] p-2 focus:outline-none focus:bg-[var(--text)] focus:text-[var(--bg)] transition-all font-mono text-sm" placeholder="YOUR NAME" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Email</label>
                  <input type="email" className="w-full bg-transparent border-b-2 border-[var(--border)] p-2 focus:outline-none focus:bg-[var(--text)] focus:text-[var(--bg)] transition-all font-mono text-sm" placeholder="EMAIL ADDRESS" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Message</label>
                  <textarea className="w-full bg-transparent border-b-2 border-[var(--border)] p-2 focus:outline-none focus:bg-[var(--text)] focus:text-[var(--bg)] transition-all font-mono text-sm min-h-[120px]" placeholder="WHAT'S ON YOUR MIND?" />
                </div>
                <button className="w-full py-4 bg-[var(--text)] text-[var(--bg)] font-bold uppercase tracking-widest hover:bg-[var(--bg)] hover:text-[var(--text)] border-2 border-[var(--border)] transition-all">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
