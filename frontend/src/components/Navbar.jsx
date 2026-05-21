import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, User, MessageSquare, Settings, Home } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ isCompact }) {
  const { logout, authUser } = useAuthStore()

  return (
    <div className={`navbar w-full flex justify-between items-center transition-all duration-500 ${
        isCompact
          ? "p-1.5 px-6 rounded-none max-w-none mt-0 border-x-0 border-t-0 bg-[var(--secondary-bg)]/90 backdrop-blur-2xl border-b border-[var(--border)] shadow-sm"
          : "p-2.5 px-6 rounded-full max-w-5xl mx-auto mt-4 top-4 glass shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      }`}>
      <nav className='flex items-center gap-3 group'>
        <div className={`bg-[var(--accent)] rounded-[1rem] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 ${isCompact ? "p-1.5" : "p-2.5"} shadow-lg shadow-black/10`}>
          <MessageSquare className={`${isCompact ? "size-4" : "size-5"} text-[var(--accent-content)]`} />
        </div>
        <Link to="/" className={`${isCompact ? "text-lg" : "text-xl"} font-extrabold tracking-tighter hover:text-[var(--accent)] transition-all font-display`}>Plavox<span className="text-[var(--accent)]">✦</span></Link>
      </nav>

      {!authUser && (
        <nav className="hidden md:block">
          <ul className={`flex flex-row gap-8 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider`}>
            <li><Link to="/" className="hover:text-[var(--text)] transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-[var(--text)] transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--text)] transition-colors">Contact</Link></li>
          </ul>
        </nav>
      )}

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <nav>
          <ul className='flex flex-row gap-4 items-center'>
            {!authUser ? (
              <>
                <li>
                  <Link to="/signin" className='px-4 py-1.5 text-[10px] font-bold hover:text-[var(--accent)] transition-colors uppercase tracking-widest'>Sign In</Link>
                </li>
                <li>
                  <Link to="/signup" className='btn-primary !px-5 !py-2 text-[10px] uppercase tracking-widest'>Get Started</Link>
                </li>
              </>
            ) : (
              <>
                <li className='hidden sm:block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest'>Hi, {authUser.fullName.split(' ')[0]}</li>
                <li className="hidden lg:block">
                  <Link to="/" className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all" title="Home">
                    <Home className="size-4" />
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className={`rounded-full border border-[var(--border)] hover:bg-[var(--accent)]/10 transition-all flex items-center gap-2 ${isCompact ? "p-2.5" : "p-3"}`}>
                    <Settings className={isCompact ? "size-4" : "size-4.5"} />
                    <span className='hidden lg:inline text-[10px] font-bold uppercase tracking-widest'>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className={`rounded-full border border-[var(--border)] hover:bg-[var(--accent)]/10 transition-all flex items-center gap-2 ${isCompact ? "p-2.5" : "p-3"}`}>
                    <User className={isCompact ? "size-4" : "size-4.5"} />
                    <span className='hidden lg:inline text-[10px] font-bold uppercase tracking-widest'>Profile</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className={`rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-2 ${isCompact ? "p-2.5" : "p-3"}`}
                  >
                    <LogOut className={isCompact ? "size-4" : "size-4.5"} />
                    <span className='hidden lg:inline text-[10px] font-bold uppercase tracking-widest'>Logout</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  )
}
