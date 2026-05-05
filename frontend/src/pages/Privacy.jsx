import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4">
        <div className="container max-w-3xl space-y-12">
          <h1 className="text-6xl font-black uppercase tracking-tighter">Privacy</h1>
          <div className="space-y-8 font-mono text-sm leading-relaxed border-t-2 border-[var(--border)] pt-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">— Data Collection</h2>
              <p>We collect only what is necessary to provide the service. This includes your email and basic account info.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">— Encryption</h2>
              <p>Your messages are encrypted. We cannot read them. Nobody else can either.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">— Third Parties</h2>
              <p>We do not sell your data. We do not use trackers. Your privacy is our priority.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
