import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, User, MessageSquare } from 'lucide-react'

export default function Navbar({ isCompact }) {
  const { logout, authUser } = useAuthStore()

  return (
    <div className={`navbar w-full flex justify-between items-center glass sticky top-0 z-50 transition-all duration-500 ${isCompact
        ? "p-1.5 px-6 rounded-none max-w-none mt-0 border-x-0 border-t-0 shadow-sm"
        : "p-4 px-8 rounded-full max-w-5xl mx-auto mt-6 top-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/5"
      }`}>
      <nav className='flex items-center gap-3'>
        <div className={`bg-[var(--accent)] rounded-[1rem] transition-all ${isCompact ? "p-1.5" : "p-2.5"} shadow-lg shadow-black/10`}>
          <MessageSquare className={`${isCompact ? "size-4" : "size-5"} text-[var(--accent-content)]`} />
        </div>
        <Link to="/" className={`${isCompact ? "text-xl" : "text-2xl"} font-extrabold tracking-tighter hover:text-[var(--accent)] transition-all font-display`}>Plavox✦</Link>
      </nav>

      {!authUser && (
        <nav className="hidden md:block">
          <ul className={`flex flex-row gap-8 text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wider`}>
            <li><Link to="/" className="hover:text-[var(--text)] transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-[var(--text)] transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--text)] transition-colors">Contact</Link></li>
          </ul>
        </nav>
      )}

      <div className="flex items-center gap-4">
        <nav>
          <ul className='flex flex-row gap-4 items-center'>
            {!authUser ? (
              <>
                <li>
                  <Link to="/signin" className='px-5 py-2 text-xs font-bold hover:text-[var(--accent)] transition-colors uppercase tracking-widest'>Sign In</Link>
                </li>
                <li>
                  <Link to="/signup" className='btn-primary !px-7 !py-3 text-xs uppercase tracking-widest'>Get Started</Link>
                </li>
              </>
            ) : (
              <>
                <li className='hidden sm:block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest'>Hi, {authUser.fullName.split(' ')[0]}</li>
                <li>
                  <Link to="/profile" className={`rounded-full border border-[var(--border)] hover:bg-[var(--accent)]/10 transition-all flex items-center gap-2.5 ${isCompact ? "p-2.5" : "p-3"}`}>
                    <User className={isCompact ? "size-4" : "size-4.5"} />
                    <span className='hidden lg:inline text-[10px] font-bold uppercase tracking-widest'>Profile</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className={`rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-2.5 ${isCompact ? "p-2.5" : "p-3"}`}
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
