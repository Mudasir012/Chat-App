import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4">
        <div className="container max-w-3xl space-y-12">
          <h1 className="text-6xl font-black uppercase tracking-tighter">Terms</h1>
          <div className="space-y-8 font-mono text-sm leading-relaxed border-t-2 border-[var(--border)] pt-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">— Usage</h2>
              <p>Don't be a jerk. Respect others. Use the platform for communication, not harassment.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">— Account</h2>
              <p>You are responsible for your account and your content. Keep your password safe.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">— Changes</h2>
              <p>We might update these terms. We'll let you know when we do.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
