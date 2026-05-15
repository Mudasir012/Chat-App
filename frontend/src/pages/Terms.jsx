import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FileText, UserCheck, RefreshCw } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-[-5%] right-[-5%] size-[400px] bg-[var(--secondary-accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <Navbar />
      <main className="flex-1 w-full flex justify-center py-20 px-4 relative z-10">
        <div className="container max-w-3xl space-y-12">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-6xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-lg text-[var(--text-muted)]">Please read these terms carefully before using Plavox.</p>
          </div>

          <div className="space-y-6 pt-12 border-t border-[var(--border)]">
            <section className="p-8 rounded-[2rem] bg-[var(--secondary-bg)] border border-[var(--border)] flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:shadow-black/5">
              <div className="size-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                <UserCheck className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Acceptable Usage</h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Be respectful to others. Use the platform for communication, not harassment or spam. We maintain a zero-tolerance policy for abuse.
                </p>
              </div>
            </section>

            <section className="p-8 rounded-[2rem] bg-[var(--secondary-bg)] border border-[var(--border)] flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:shadow-black/5">
              <div className="size-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                <FileText className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Account Responsibility</h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  You are responsible for your account security and any content you share. Please keep your credentials safe and report any unauthorized access.
                </p>
              </div>
            </section>

            <section className="p-8 rounded-[2rem] bg-[var(--secondary-bg)] border border-[var(--border)] flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:shadow-black/5">
              <div className="size-14 rounded-2xl bg-[var(--secondary-accent)]/10 flex items-center justify-center text-[var(--secondary-accent)] shrink-0">
                <RefreshCw className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Updates & Changes</h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  We may occasionally update these terms to reflect changes in our service or legal requirements. We will notify you of any significant updates.
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

