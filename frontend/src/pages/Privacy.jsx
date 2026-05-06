import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ShieldCheck, Lock, EyeOff } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-[-5%] left-[-5%] size-[400px] bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4 relative z-10">
        <div className="container max-w-3xl space-y-12">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-6xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-lg text-[var(--text-muted)]">How we protect your data and respect your privacy.</p>
          </div>

          <div className="space-y-6 pt-12 border-t border-[var(--border)]">
            <section className="p-8 rounded-[2rem] bg-[var(--secondary-bg)] border border-[var(--border)] flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                <ShieldCheck className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Data Collection</h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  We collect only what is necessary to provide the service. This includes your email and basic account information required for authentication.
                </p>
              </div>
            </section>

            <section className="p-8 rounded-[2rem] bg-[var(--secondary-bg)] border border-[var(--border)] flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[var(--accent)] shrink-0">
                <Lock className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Encryption</h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Your messages are protected with end-to-end encryption. We cannot read them, and neither can any third party. Your conversations remain truly private.
                </p>
              </div>
            </section>

            <section className="p-8 rounded-[2rem] bg-[var(--secondary-bg)] border border-[var(--border)] flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="size-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-[var(--secondary-accent)] shrink-0">
                <EyeOff className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Third Parties</h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  We do not sell your data. We do not use advertising trackers. Your personal information is never shared with third-party advertisers.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

