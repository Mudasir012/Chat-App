import { motion } from 'framer-motion'

export default function Marquee({ text }) {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-4 bg-[rgba(167,139,250,0.04)] border-y border-[var(--border)] flex relative z-10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="flex gap-0 items-center"
      >
        {[...Array(15)].map((_, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--text-muted)] px-8">
              {text}
            </span>
            <span className="text-[var(--accent)] text-xs">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

