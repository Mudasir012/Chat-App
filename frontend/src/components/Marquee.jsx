import { motion } from 'framer-motion'

export default function Marquee({ text }) {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-4 border-y-2 border-black bg-black text-white flex">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="flex gap-10 items-center"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-4xl font-black uppercase tracking-tighter italic">
            {text} •
          </span>
        ))}
      </motion.div>
    </div>
  )
}
