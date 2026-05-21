import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Settings as SettingsIcon, Bell, Shield, Trash2, Palette, Sun, Moon, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();

  const themes = [
    { id: "dark", name: "Deep Space (Dark)", icon: <Moon className="size-5" /> },
    { id: "light", name: "Pure Light (Light)", icon: <Sun className="size-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="grid-bg" />
      <div className="orb w-[500px] h-[500px] bg-[var(--orb-1)] top-[-200px] right-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-[var(--orb-2)] bottom-0 left-[-100px]" />

      <Navbar />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-4">
            <div className="glass p-6 rounded-[2rem] border border-[var(--border)] shadow-xl">
              <h2 className="text-lg font-bold flex items-center gap-2.5 mb-6 uppercase tracking-wider font-display">
                <SettingsIcon className="size-5 text-[var(--accent)]" /> Settings
              </h2>
              <div className="space-y-2">
                <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-xs uppercase tracking-wider transition-all">
                  <Palette className="size-4" /> Appearance
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-[var(--secondary-bg)] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] text-xs uppercase tracking-wider transition-all">
                  <Bell className="size-4" /> Notifications
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-[var(--secondary-bg)] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] text-xs uppercase tracking-wider transition-all">
                  <Shield className="size-4" /> Privacy
                </button>
                <div className="h-px bg-[var(--border)] my-2" />
                <button className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider transition-all">
                  <Trash2 className="size-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-8">
            {/* Theme Selection */}
            <section className="bg-[var(--secondary-bg)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-xl space-y-6">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Customization</p>
                <h3 className="text-2xl font-bold tracking-tight font-display">Theme Selection</h3>
                <p className="text-sm text-[var(--text-muted)] font-light">Choose a theme that fits your workspace vibe.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    className={`
                      group flex items-center justify-between p-5 rounded-2xl transition-all border text-left cursor-pointer
                      ${theme === t.id 
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_8px_30px_rgba(59,130,246,0.1)]" 
                        : "border-[var(--border)] hover:border-[var(--text-muted)]/30 hover:bg-[var(--bg)]/40"}
                    `}
                    onClick={() => setTheme(t.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                        theme === t.id ? "bg-[var(--accent)] text-[var(--accent-content)]" : "bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]"
                      }`}>
                        {t.icon}
                      </div>
                      <div>
                        <span className="text-sm font-bold block">{t.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                          {t.id === "dark" ? "Dark first mode" : "Clean light mode"}
                        </span>
                      </div>
                    </div>
                    {theme === t.id && (
                      <div className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Chat Preview */}
            <section className="bg-[var(--secondary-bg)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-xl space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Real-time preview</p>
                <h3 className="text-xl font-bold tracking-tight font-display">Interface Preview</h3>
              </div>

              <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg)] shadow-inner">
                <div className="p-4 bg-[var(--secondary-bg)] border-b border-[var(--border)] flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-bold border border-[var(--accent)]/10">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-xs tracking-tight">Sarah Jenkins</h3>
                    <p className="text-[9px] font-bold text-green-500 uppercase tracking-wider">Online Now</p>
                  </div>
                </div>

                <div className="p-6 space-y-5 min-h-[220px] max-h-[220px] overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-[var(--secondary-bg)] text-[var(--text)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed font-medium shadow-sm">
                      Hey! How does the selected theme look on your end?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-[var(--accent)] text-[var(--accent-content)] p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed font-bold shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
                      It looks absolutely stunning and incredibly premium! 🚀
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[var(--border)] bg-[var(--secondary-bg)]/30 flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-xs focus:outline-none cursor-not-allowed text-[var(--text-muted)] font-medium" 
                    placeholder="Type a message..." 
                    disabled 
                  />
                  <button className="btn-primary py-2 px-5 text-xs uppercase tracking-wider rounded-xl cursor-not-allowed opacity-60" disabled>
                    Send
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
