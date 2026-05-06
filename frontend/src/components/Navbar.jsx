import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, User, MessageSquare } from 'lucide-react'

export default function Navbar({ isCompact }) {
  const { logout, authUser } = useAuthStore()

  return (
    <div className={`navbar w-full flex justify-between items-center glass sticky top-0 z-50 transition-all duration-500 ${
      isCompact 
        ? "p-2 px-6 rounded-none max-w-none mt-0 border-x-0 border-t-0" 
        : "p-4 px-8 rounded-full max-w-5xl mx-auto mt-5 top-5 shadow-2xl"
    }`}>
      <nav className='flex items-center gap-3'>
        <div className={`bg-[var(--accent)] rounded-xl transition-all ${isCompact ? "p-1.5" : "p-2"}`}>
          <MessageSquare className={`${isCompact ? "size-4" : "size-5"} text-[#08080f]`} />
        </div>
        <Link to="/" className={`${isCompact ? "text-lg" : "text-xl"} font-bold tracking-tighter hover:text-[var(--accent)] transition-all font-display`}>chatly✦</Link>
      </nav>
      
      {!authUser && (
        <nav className="hidden md:block">
          <ul className={`flex flex-row gap-8 text-[13px] font-medium text-[var(--text-muted)]`}>
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
                  <Link to="/signin" className='px-5 py-2 text-xs font-bold hover:text-[var(--accent)] transition-colors uppercase tracking-wider'>Sign In</Link>
                </li>
                <li>
                  <Link to="/signup" className='btn-primary !px-6 !py-2.5 text-xs'>Get Started</Link>
                </li>
              </>
            ) : (
              <>
                <li className='hidden sm:block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider'>Hi, {authUser.fullName.split(' ')[0]}</li>
                <li>
                  <Link to="/profile" className={`rounded-xl border border-[var(--border)] hover:bg-white/5 transition-all flex items-center gap-2 ${isCompact ? "p-2" : "p-2.5"}`}>
                    <User className={isCompact ? "size-3.5" : "size-4"} />
                    <span className='hidden lg:inline text-[10px] font-bold uppercase tracking-wider'>Profile</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className={`rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-2 ${isCompact ? "p-2" : "p-2.5"}`}
                  >
                    <LogOut className={isCompact ? "size-3.5" : "size-4"} />
                    <span className='hidden lg:inline text-[10px] font-bold uppercase tracking-wider'>Logout</span>
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


