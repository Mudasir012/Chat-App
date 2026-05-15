import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full flex justify-center py-20 px-4 relative z-10 border-t border-[var(--border)]">
      <div className="container max-w-6xl flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-3">
          <div className='p-2 bg-[var(--surface)] rounded-xl'>
            <MessageSquare className='size-5 text-[var(--accent)]' />
          </div>
          <span className="text-xl font-bold tracking-tighter font-display">Plavox✦</span>
        </div>
        
        <div className="flex gap-10 text-[13px] font-medium text-[var(--text-muted)]">
          <Link to="/privacy" className="hover:text-[var(--text)] transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-[var(--text)] transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-[var(--text)] transition-colors">Contact</Link>
        </div>
        
        <div className="text-[12px] text-[var(--text-muted)] font-light">
          © 2026 Plavox. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

