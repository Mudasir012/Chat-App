import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full flex justify-center py-12 px-4 border-t-2 border-[var(--border)] bg-[var(--bg)]">
      <div className="container max-w-5xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-black tracking-tighter">CHAT APP</div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
          <Link to="/privacy" className="hover:line-through">Privacy</Link>
          <Link to="/terms" className="hover:line-through">Terms</Link>
          <Link to="/contact" className="hover:line-through">Contact</Link>
        </div>
        <div className="text-[10px] font-mono opacity-50">© 2026 CHAT APP INC.</div>
      </div>
    </footer>
  )
}
