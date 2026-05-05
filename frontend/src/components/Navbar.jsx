import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, User, MessageSquare } from 'lucide-react'

export default function Navbar() {
  const { logout, authUser } = useAuthStore()

  return (
    <div className="navbar w-full flex justify-between items-center p-4 border-b-2 border-[var(--border)] bg-[var(--bg)] sticky top-0 z-50">
      <nav className='flex items-center gap-2'>
        <div className='p-1 bg-[var(--text)] hidden sm:block'>
          <MessageSquare className='size-5 text-[var(--bg)]' />
        </div>
        <Link to="/" className="text-xl font-black tracking-tighter hover:text-red-600 transition-all uppercase">Chat App</Link>
      </nav>
      
      {!authUser && (
        <nav className="hidden md:block">
          <ul className='flex flex-row gap-8 text-xs font-bold uppercase tracking-wider'>
            <li className='hover:line-through'><Link to="/">Home</Link></li>
            <li className='hover:line-through'><Link to="/about">About</Link></li>
            <li className='hover:line-through'><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      )}

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <nav>
          <ul className='flex flex-row gap-4 items-center'>
            {!authUser ? (
              <>
                <li className='px-4 py-1.5 border-2 border-[var(--border)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors text-xs font-bold uppercase'><Link to="/signin">SignIn</Link></li>
                <li className='px-4 py-1.5 bg-red-600 text-white border-2 border-red-600 hover:bg-[var(--bg)] hover:text-red-600 transition-colors text-xs font-bold uppercase shadow-[4px_4px_0px_0px_var(--border)]'><Link to="/signup">SignUp</Link></li>
              </>
            ) : (
              <>
                <li className='hidden sm:block text-[10px] font-black uppercase opacity-50 tracking-widest'>Hi, {authUser.fullName.split(' ')[0]}</li>
                <li className='px-3 py-1.5 border-2 border-[var(--border)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-all'>
                  <Link to="/profile" className='flex items-center gap-2 text-xs font-bold uppercase'>
                    <User className='size-4' />
                    <span className='hidden lg:inline'>Profile</span>
                  </Link>
                </li>
                <li className='px-3 py-1.5 bg-red-600 text-white border-2 border-red-600 hover:bg-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_var(--border)]' onClick={logout}>
                  <div className='flex items-center gap-2 text-xs font-bold uppercase'>
                    <LogOut className='size-4' />
                    <span className='hidden lg:inline'>Logout</span>
                  </div>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  )
}

