import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Settings as SettingsIcon, Bell, Shield, Trash2, Palette } from "lucide-react";
import Navbar from "../components/Navbar";

const THEMES = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-base-100 p-4 border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
              <h2 className="font-black uppercase flex items-center gap-2 mb-4">
                <SettingsIcon className="size-5" /> Settings
              </h2>
              <div className="space-y-1">
                <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-primary/10 text-primary font-bold">
                  <Palette className="size-4" /> Appearance
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-base-200 font-bold">
                  <Bell className="size-4" /> Notifications
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-base-200 font-bold">
                  <Shield className="size-4" /> Privacy
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 text-red-600 font-bold">
                  <Trash2 className="size-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <section className="bg-base-100 p-8 border-4 border-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
              <h3 className="text-xl font-black uppercase italic mb-6">Theme Selection</h3>
              <p className="text-sm text-base-content/60 font-bold mb-6 italic uppercase tracking-wider">Choose a theme that fits your vibe</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    className={`
                      group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border-2
                      ${theme === t ? "border-primary bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-transparent hover:bg-base-200"}
                    `}
                    onClick={() => setTheme(t)}
                  >
                    <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                        <div className="rounded bg-primary"></div>
                        <div className="rounded bg-secondary"></div>
                        <div className="rounded bg-accent"></div>
                        <div className="rounded bg-neutral"></div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase truncate w-full text-center">
                      {t}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-base-100 p-8 border-4 border-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
              <h3 className="text-xl font-black uppercase italic mb-6">Preview</h3>
              <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
                <div className="p-4 bg-base-200 border-b border-base-300 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-content font-black">J</div>
                  <div>
                    <h3 className="font-bold text-sm">John Doe</h3>
                    <p className="text-[10px] text-base-content/60 uppercase font-black">Online</p>
                  </div>
                </div>

                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-base-200 p-3 rounded-2xl rounded-tl-none font-bold text-sm shadow-sm">
                      Hey! How's the new theme looking?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-primary text-primary-content p-3 rounded-2xl rounded-tr-none font-bold text-sm shadow-sm">
                      Looks absolutely brutal! 🚀
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-base-300 flex gap-2">
                  <input type="text" className="input input-bordered flex-1 input-sm font-bold" placeholder="Type a message..." readOnly />
                  <button className="btn btn-primary btn-sm px-4">SEND</button>
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
