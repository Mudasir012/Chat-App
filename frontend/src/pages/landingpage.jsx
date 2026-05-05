import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Marquee from '../components/Marquee'

const CHAT_SCENARIOS = [
  {
    type: "Direct Message",
    name: "Sarah Miller",
    messages: [
      { id: 1, text: "Hey! Did you see the new design?", sender: "friend" },
      { id: 2, text: "Just now! The brutalist look is bold.", sender: "me" },
      { id: 3, text: "Exactly what we needed. ⚡", sender: "friend" }
    ]
  },
  {
    type: "Group Chat",
    name: "Dev Squad 🚀",
    messages: [
      { id: 1, text: "Backend is deployed to main.", sender: "friend", name: "Alex" },
      { id: 2, text: "Sweet. Testing the socket connections now.", sender: "me" },
      { id: 3, text: "All systems green! ✅", sender: "other", name: "Jordan" }
    ]
  },
  {
    type: "System",
    name: "Security Bot",
    messages: [
      { id: 1, text: "New login detected from Tokyo, JP.", sender: "friend" },
      { id: 2, text: "That's my VPN, we're good.", sender: "me" },
      { id: 3, text: "Session verified. Stay safe. 🛡️", sender: "friend" }
    ]
  },
  {
    type: "Gaming",
    name: "Final Boss Raid",
    messages: [
      { id: 1, text: "Everyone on discord?", sender: "friend", name: "GamerX" },
      { id: 2, text: "I'm ready. Let's get that loot.", sender: "me" },
      { id: 3, text: "Wait for me! My PC is lagging.", sender: "other", name: "Noob123" }
    ]
  },
  {
    type: "Family",
    name: "The Fam Jam 🏠",
    messages: [
      { id: 1, text: "Dinner at 7 tonight?", sender: "friend", name: "Mom" },
      { id: 2, text: "I'll be there! Bringing dessert.", sender: "me" },
      { id: 3, text: "Can we have pizza instead?", sender: "other", name: "Little Bro" }
    ]
  },
  {
    type: "Work",
    name: "Product Launch",
    messages: [
      { id: 1, text: "Marketing assets are ready.", sender: "friend", name: "Design Lead" },
      { id: 2, text: "Great. Engineering is finishing the build.", sender: "me" },
      { id: 3, text: "Let's sync at 10 AM tomorrow.", sender: "other", name: "Product Mgr" }
    ]
  },
  {
    type: "Support",
    name: "ChatApp Help",
    messages: [
      { id: 1, text: "Hi! How can I help you today?", sender: "friend", name: "Support AI" },
      { id: 2, text: "My messages aren't loading.", sender: "me" },
      { id: 3, text: "Try refreshing the page. Should work now!", sender: "friend", name: "Support AI" }
    ]
  },
  {
    type: "Cryptic",
    name: "0xUNKNOWN",
    messages: [
      { id: 1, text: "Are you in?", sender: "friend" },
      { id: 2, text: "The signal is strong.", sender: "me" },
      { id: 3, text: "Meet at the coordinate. 📍", sender: "friend" }
    ]
  },
  {
    type: "Travel",
    name: "Summer Trip 🏖️",
    messages: [
      { id: 1, text: "Hotel is booked for Bali!", sender: "friend", name: "Chloe" },
      { id: 2, text: "Finally! Can't wait for the beach.", sender: "me" },
      { id: 3, text: "Pack your sunscreen! ☀️", sender: "other", name: "Mark" }
    ]
  },
  {
    type: "Community",
    name: "Global Announcements",
    messages: [
      { id: 1, text: "Welcome to our 1 millionth user!", sender: "friend", name: "Admin" },
      { id: 2, text: "Wow! Big milestone. 🎉", sender: "me" },
      { id: 3, text: "Stay tuned for major updates.", sender: "friend", name: "Admin" }
    ]
  }
]

function ChatDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const currentScenario = CHAT_SCENARIOS[scenarioIndex]

  useEffect(() => {
    let timeout
    const addMessage = (index) => {
      if (index >= currentScenario.messages.length) {
        timeout = setTimeout(() => {
          setMessages([])
          setScenarioIndex((prev) => (prev + 1) % CHAT_SCENARIOS.length)
        }, 3000)
        return
      }

      setIsTyping(true)
      timeout = setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [...prev, currentScenario.messages[index]])
        timeout = setTimeout(() => addMessage(index + 1), 1500)
      }, 1000)
    }

    addMessage(0)
    return () => clearTimeout(timeout)
  }, [scenarioIndex])

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg)] font-mono">
      {/* Chat Header */}
      <div className="p-3 border-b-2 border-[var(--border)] flex justify-between items-center bg-[var(--text)] text-[var(--bg)]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold opacity-50">{currentScenario.type}</span>
          <span className="text-xs font-black uppercase tracking-tighter">{currentScenario.name}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden space-y-3 p-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'me' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col gap-1">
                {msg.name && <span className="text-[8px] uppercase font-bold opacity-50">{msg.name}</span>}
                <div
                  className={`px-3 py-1.5 border-2 border-[var(--border)] text-xs sm:text-sm ${
                    msg.sender === 'me' ? 'bg-[var(--text)] text-[var(--bg)]' : 'bg-[var(--bg)] text-[var(--text)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="px-3 py-1.5 border-2 border-[var(--border)] bg-[var(--bg)] text-xs italic">
              typing...
            </div>
          </motion.div>
        )}
      </div>
      <div className="mt-auto p-3 border-t-2 border-[var(--border)] flex items-center justify-between bg-[var(--bg)]">
        <span className="text-[10px] uppercase tracking-widest font-bold">Live Demo</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-pulse delay-75" />
          <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-pulse delay-150" />
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col relative overflow-x-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(var(--text) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <Navbar />
      
      <Marquee text="Instant Messaging • End-to-End Encryption • Global Community • Simple UI • No Tracking" />

      <div className='w-full flex justify-center py-10 px-4 relative z-10'>
        <div className='container max-w-5xl h-[75vh] border-2 border-[var(--border)] flex flex-col md:flex-row overflow-hidden bg-[var(--bg)] shadow-[12px_12px_0px_0px_var(--border)]'>
          <div className='logoAndIntro w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8 border-b-2 md:border-b-0 md:border-r-2 border-[var(--border)] relative overflow-hidden group'>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 text-center"
            >
              <h1 className='text-8xl font-black tracking-tighter leading-[0.8] flex flex-col items-center'>
                {["CHAT", "APP"].map((word, i) => (
                  <motion.span 
                    key={i}
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="hover:italic transition-all duration-300 cursor-default"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] border-t-2 border-[var(--border)] pt-4 inline-block"
              >
                Simple • Secure • Fast
              </motion.p>
            </motion.div>
            
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-12 h-12 border-b-2 border-l-2 border-[var(--border)] flex items-center justify-center bg-red-600 text-white text-[8px] font-black uppercase rotate-45 translate-x-6 -translate-y-6">
              New
            </div>
          </div>
          
          <div className="demo w-full md:w-1/2 h-1/2 md:h-full bg-[var(--bg)] relative">
             {/* Abstract Lines */}
             <div className="absolute inset-0 pointer-events-none opacity-5">
               <div className="absolute top-0 left-1/4 w-px h-full bg-[var(--text)]" />
               <div className="absolute top-1/4 left-0 w-full h-px bg-[var(--text)]" />
             </div>
            <ChatDemo />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="w-full flex justify-center py-20 px-4 border-t-2 border-[var(--border)]">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-black tracking-tighter mb-12 uppercase">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t-2 border-l-2 border-[var(--border)]">
            {[
              { title: "Encrypted", desc: "End-to-end security for your data." },
              { title: "Real-time", desc: "Instant messaging without delays." },
              { title: "Global", desc: "Connect with anyone, anywhere." },
              { title: "Free", desc: "No hidden costs, just chatting." },
              { title: "Simple", desc: "Minimalist UI for maximum focus." },
              { title: "Fast", desc: "Optimized for speed and efficiency." },
            ].map((f, i) => (
              <div key={i} className="p-8 border-b-2 border-r-2 border-[var(--border)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors group">
                <span className="text-xs font-mono mb-4 block opacity-50 group-hover:opacity-100">0{i + 1}</span>
                <h3 className="text-xl font-bold mb-2 uppercase">{f.title}</h3>
                <p className="text-sm opacity-70 group-hover:opacity-100">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full flex justify-center py-20 px-4 bg-[var(--text)] text-[var(--bg)]">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-black tracking-tighter mb-12 uppercase text-[var(--bg)]">How it Works</h2>
          <div className="space-y-8">
            {[
              "Create an account in seconds.",
              "Invite your friends via unique link.",
              "Start chatting in real-time."
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center gap-6 group"
              >
                <span className="text-5xl font-black text-[var(--bg)] opacity-20 group-hover:opacity-100 transition-colors">0{i + 1}</span>
                <p className="text-2xl font-bold tracking-tight uppercase">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full flex justify-center py-20 px-4 border-t-2 border-[var(--border)]">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-black tracking-tighter mb-12 uppercase">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border-2 border-[var(--border)] flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_var(--border)] transition-all">
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase">Basic</h3>
                <p className="text-sm opacity-70 italic">For casual chatting.</p>
                <div className="text-4xl font-black">$0<span className="text-sm">/mo</span></div>
                <ul className="text-sm space-y-2 border-t-2 border-[var(--border)] pt-4">
                  <li>— Unlimited messages</li>
                  <li>— 100MB file storage</li>
                  <li>— Group chats</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-3 border-2 border-[var(--border)] font-bold uppercase hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors">Select</button>
            </div>
            <div className="p-8 border-2 border-[var(--border)] bg-[var(--text)] text-[var(--bg)] flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_var(--accent)] transition-all">
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase text-[var(--bg)]">Pro</h3>
                <p className="text-sm opacity-70 italic">For power users.</p>
                <div className="text-4xl font-black text-[var(--bg)]">$10<span className="text-sm">/mo</span></div>
                <ul className="text-sm space-y-2 border-t-2 border-[var(--bg)] opacity-30 pt-4">
                  <li>— Everything in Basic</li>
                  <li>— 10GB file storage</li>
                  <li>— Custom themes</li>
                  <li>— Priority support</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-3 bg-red-600 text-white font-bold uppercase hover:bg-[var(--bg)] hover:text-red-600 border-2 border-red-600 transition-colors shadow-[4px_4px_0px_0px_var(--bg)]">Select</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}