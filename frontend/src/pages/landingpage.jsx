import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Marquee from '../components/Marquee'
import { Zap, Rocket, Phone, Video, Send, Smile, Paperclip, MoreVertical, CheckCheck } from 'lucide-react'

function ChatDemo() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const replyTimerRef = useRef(null);
  const scriptIndexRef = useRef(0);
  const isUserInteractingRef = useRef(false);

  const AUTOPLAY_SCRIPT = [
    { sender: "Sarah", text: "Hey! Did you check out the new design system?", delay: 1500, typingTime: 1200 },
    { sender: "You", text: "Yeah! It looks incredibly clean. The glassmorphism is spot on. ✨", delay: 1500, typingTime: 1200 },
    { sender: "Sarah", text: "I know, right? And the message delivery is under 50ms.", delay: 1500, typingTime: 1000 },
    { sender: "Sarah", text: "Try typing a message below to test it yourself! 👇", delay: 1500, typingTime: 1200 }
  ];

  const SARAH_REPLIES = [
    "That is so cool! Plavox is built for real-time engagement.",
    "Agreed! And the best part is that everything is end-to-end encrypted.",
    "Nice! Try signing up above to create your own room and invite friends.",
    "Exactly! Real-time messaging with no lag at all.",
    "Haha yes! Let's get everyone to transition over to this."
  ];

  const replyIndexRef = useRef(0);

  // Scroll to bottom on new messages or typing state change without shifting window viewport
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // Run autoplay script
  useEffect(() => {
    if (isUserInteractingRef.current) return;

    const runScriptStep = () => {
      const step = AUTOPLAY_SCRIPT[scriptIndexRef.current];
      if (!step) {
        // Wait at the end of the script before repeating
        autoplayTimerRef.current = setTimeout(() => {
          setMessages([]);
          scriptIndexRef.current = 0;
          runScriptStep();
        }, 6000);
        return;
      }

      autoplayTimerRef.current = setTimeout(() => {
        // Show typing indicator
        if (step.sender !== "You") {
          setIsTyping(true);
        }
        
        typingTimerRef.current = setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              sender: step.sender,
              text: step.text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: step.sender === "You"
            }
          ]);
          scriptIndexRef.current += 1;
          runScriptStep();
        }, step.typingTime);

      }, step.delay);
    };

    runScriptStep();

    return () => {
      clearTimeout(autoplayTimerRef.current);
      clearTimeout(typingTimerRef.current);
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Set user as interacting to stop autoplay
    isUserInteractingRef.current = true;
    clearTimeout(autoplayTimerRef.current);
    clearTimeout(typingTimerRef.current);
    clearTimeout(replyTimerRef.current);
    setIsTyping(false);

    const userMessage = {
      id: Date.now(),
      sender: "You",
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Trigger Sarah's typing response
    setIsTyping(true);
    replyTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      const replyText = SARAH_REPLIES[replyIndexRef.current % SARAH_REPLIES.length];
      replyIndexRef.current += 1;

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "Sarah",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false
        }
      ]);
    }, 1500);
  };

  return (
    <div className="h-full w-full bg-[var(--secondary-bg)] rounded-[1.8rem] flex flex-col justify-between overflow-hidden border border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)]/30 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="size-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center font-bold text-xs border border-[var(--accent)]/30">
              S
            </div>
            <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-[var(--secondary-bg)]" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight">Sarah Connor</p>
            <p className="text-[9px] text-emerald-500 font-medium">
              {isTyping ? "typing..." : "online"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
          <button type="button" className="hover:text-[var(--text)] transition-colors cursor-pointer"><Phone className="size-3.5" /></button>
          <button type="button" className="hover:text-[var(--text)] transition-colors cursor-pointer"><Video className="size-3.5" /></button>
          <button type="button" className="hover:text-[var(--text)] transition-colors cursor-pointer"><MoreVertical className="size-3.5" /></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col min-h-0">
        {messages.length === 0 && !isTyping && (
          <div className="h-full flex items-center justify-center text-center p-4">
            <p className="text-[11px] text-[var(--text-muted)]/70 leading-relaxed italic">
              Loading chat demo...
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.isMe ? "ml-auto items-end" : "items-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-2xl text-xs break-words shadow-sm leading-relaxed ${
                msg.isMe
                  ? "bg-[var(--accent)] text-[var(--accent-content)] rounded-tr-none"
                  : "bg-[var(--surface)] text-[var(--text)] rounded-tl-none border border-[var(--border)]"
              }`}
            >
              {msg.text}
            </div>
            <div className="flex items-center gap-1 mt-1 px-1">
              <span className="text-[8px] text-[var(--text-muted)]/70">{msg.time}</span>
              {msg.isMe && (
                <CheckCheck className="size-3 text-[var(--accent-hover,#60A5FA)]" />
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col max-w-[85%] items-start">
            <div className="px-3.5 py-2 bg-[var(--surface)] rounded-2xl rounded-tl-none border border-[var(--border)] flex items-center gap-1 shadow-sm h-8">
              <span className="size-1.5 bg-[var(--text-muted)]/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="size-1.5 bg-[var(--text-muted)]/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="size-1.5 bg-[var(--text-muted)]/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-2 bg-[var(--surface)]/20 border-t border-[var(--border)] flex items-center gap-1.5">
        <button type="button" className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer">
          <Paperclip className="size-3.5" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a preview message..."
          className="flex-1 min-w-0 bg-[var(--bg)]/50 border border-[var(--border)] rounded-full px-3 py-1.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent)] transition-all"
        />
        <button type="button" className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer">
          <Smile className="size-3.5" />
        </button>
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`p-1.5 rounded-full flex items-center justify-center transition-all ${
            inputValue.trim()
              ? "bg-[var(--accent)] text-[var(--accent-content)] hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-[var(--surface)] text-[var(--text-muted)]/40 cursor-not-allowed"
          }`}
        >
          <Send className="size-3" />
        </button>
      </form>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative overflow-x-hidden selection:bg-[var(--accent)] selection:text-[var(--accent-content)]">
      {/* Dynamic Background */}
      <div className="grid-bg" />
      <div className="orb w-[500px] h-[500px] bg-[var(--orb-1)] top-[-200px] right-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-[var(--orb-2)] bottom-0 left-[-100px]" />
      <div className="orb w-[300px] h-[300px] bg-[var(--orb-3)] top-[40%] left-[30%]" />
      
      <Navbar />
      
      <main className='w-full flex flex-col items-center py-10 px-4 relative z-10 flex-grow justify-center'>
        <div className='container max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div className='space-y-8 text-center lg:text-left'>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(173,181,189,0.07)] border border-[rgba(173,181,189,0.3)] text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider"
            >
              <div className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span>Now in open beta</span>
            </motion.div>
            
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95]'>
              Chat that hits<br />
              <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--secondary-accent)] to-[var(--accent)] bg-clip-text text-transparent font-black">different.</span>
            </h1>
            
            <p className="text-lg text-[var(--text-muted)] max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Secure, fast, and actually good-looking. No cringe UI, no ads, no data selling. Just pure connection.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <Link to="/signup" className="btn-primary flex items-center gap-2 group">
                Get started — it's free
                <Rocket className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="btn-ghost">
                See how it works
              </Link>
            </div>
            
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-8 border-t border-[var(--border)]">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="size-9 rounded-full border-2 border-[var(--bg)] bg-[var(--surface)] overflow-hidden flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)]">
                    {['SJ', 'MK', 'AZ', 'RB'][i-1]}
                  </div>
                ))}
              </div>
              <p className="text-xs font-light text-[var(--text-muted)]">
                Joined by <span className="text-[var(--text)] font-semibold">10,000+</span> people worldwide
              </p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             {/* Abstract Glow for Demo */}
             <div className="absolute inset-0 bg-[var(--accent)] opacity-5 blur-[100px] rounded-full -z-10" />
             
             {/* Floating Badges */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-6 -right-10 px-4 py-3 glass rounded-2xl shadow-2xl flex items-center gap-3 hidden md:flex"
             >
               <div className="size-8 rounded-lg bg-[rgba(173,181,189,0.12)] flex items-center justify-center text-[var(--accent-green)] text-sm">
                 🔒
               </div>
               <div>
                 <p className="text-[11px] font-bold">E2E Encrypted</p>
                 <p className="text-[9px] text-[var(--text-muted)]">Always secure</p>
               </div>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-20 -left-10 px-4 py-3 glass rounded-2xl shadow-2xl flex items-center gap-3 hidden md:flex"
             >
               <div className="size-8 rounded-lg bg-[rgba(108,117,125,0.12)] flex items-center justify-center text-[var(--accent)] text-sm">
                 ⚡
               </div>
               <div>
                 <p className="text-[11px] font-bold">&lt; 50ms latency</p>
                 <p className="text-[9px] text-[var(--text-muted)]">Instant delivery</p>
               </div>
             </motion.div>

             <div className="max-w-[320px] mx-auto p-1 bg-[var(--secondary-bg)]/50 backdrop-blur-2xl rounded-[2rem] border border-[var(--border)] shadow-2xl shadow-black/50">
                <div className="h-[460px] w-full rounded-[1.8rem] overflow-hidden">
                  <ChatDemo />
                </div>
             </div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full flex justify-center py-24 px-4 relative z-10 border-t border-[var(--border)]">
        <div className="container max-w-6xl">
          <div className="text-left mb-16 max-w-2xl">
            <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-4">Why Plavox?</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-none">Built different,<br />for real.</h2>
            <p className="text-lg text-[var(--text-muted)] font-light leading-relaxed">Everything you'd want in a messaging app, nothing you wouldn't.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🔐", title: "End-to-End encryption", desc: "Every message, file, and call is end-to-end encrypted. Not opt-in — always on.", wide: true, color: "rgba(173,181,189,0.12)" },
              { icon: "⚡", title: "Actually instant", desc: "Sub-50ms delivery on our global edge network. No lag, no buffering.", color: "rgba(108,117,125,0.12)" },
              { icon: "✨", title: "UI that slaps", desc: "Designed from scratch to be genuinely beautiful. Dark mode that's actually dark.", color: "rgba(73,80,87,0.12)" },
              { icon: "🌍", title: "Global by default", desc: "Servers across 40+ regions mean your messages travel the shortest path.", color: "rgba(248,249,250,0.12)" },
              { icon: "❤️", title: "Free forever", desc: "Core features stay free. No ads, no data selling, no sketchy monetization.", color: "rgba(173,181,189,0.12)" },
              { icon: "🚀", title: "Groups that work", desc: "Up to 500 people, threaded replies, reactions. Group chats that don't devolve.", color: "rgba(108,117,125,0.12)" },
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, borderColor: 'var(--accent)', boxShadow: '0 10px 30px -10px rgba(59,130,246,0.15)' }}
                className={`p-8 bg-[var(--secondary-bg)] rounded-[2rem] border border-[var(--border)] shadow-sm transition-all ${f.wide ? 'md:col-span-2' : ''}`}
              >
                <div className="size-14 rounded-2xl flex items-center justify-center text-2xl mb-8" style={{ backgroundColor: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full flex justify-center py-24 px-4 relative z-10 border-t border-[var(--border)]">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Simple pricing,<br />no cap.</h2>
            <p className="text-lg text-[var(--text-muted)] font-light">Pick what works for you. Upgrade anytime, no questions asked.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-12 bg-[var(--secondary-bg)] rounded-[2.5rem] border border-[var(--border)] flex flex-col justify-between shadow-xl">
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">Basic</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-2 font-light">For casual chatting.</p>
                </div>
                <div className="text-6xl font-extrabold tracking-tighter">$0<span className="text-xl font-light text-[var(--text-muted)] tracking-normal ml-2">/mo</span></div>
                <div className="h-px bg-[var(--border)]" />
                <ul className="space-y-4">
                  {["Unlimited messages", "100MB file storage", "Group chats up to 50", "E2E encryption"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-light">
                      <div className="size-5 rounded-full bg-[rgba(173,181,189,0.15)] flex items-center justify-center text-[var(--accent-green)]">
                        <Zap className="size-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-12 btn-ghost w-full">Get started free</button>
            </div>

            <div className="p-12 bg-[var(--surface)] rounded-[2.5rem] border border-[rgba(173,181,189,0.3)] flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                 <div className="px-4 py-1.5 bg-[var(--accent)] text-[#212529] rounded-full text-[10px] font-bold uppercase tracking-widest">Most Popular ✦</div>
              </div>
              <div className="space-y-8 relative z-10">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">Pro</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-2 font-light">For power users.</p>
                </div>
                <div className="text-6xl font-extrabold tracking-tighter text-[var(--accent)]">$10<span className="text-xl font-light text-[var(--text-muted)] tracking-normal ml-2">/mo</span></div>
                <div className="h-px bg-[var(--border)]" />
                <ul className="space-y-4">
                  {["Everything in Basic", "10GB file storage", "Groups up to 500", "Custom themes", "Priority support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-light">
                      <div className="size-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-[#212529]">
                        <Zap className="size-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-12 btn-primary w-full text-base">Upgrade to Pro</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
