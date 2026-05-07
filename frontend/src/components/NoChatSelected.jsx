import { MessageSquare, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[var(--bg)] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="grid-bg opacity-30" />
      <div className="orb w-64 h-64 bg-[rgba(173,181,189,0.05)] top-1/4 right-1/4" style={{ animationDelay: '0s' }} />
      <div className="orb w-48 h-48 bg-[rgba(108,117,125,0.03)] bottom-1/4 left-1/4" style={{ animationDelay: '-2s' }} />

      <div className="max-w-md text-center space-y-8 relative z-10">
        {/* Icon Display */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div
              className="size-24 rounded-[2rem] bg-[var(--accent)] flex items-center
             justify-center shadow-2xl shadow-black/30 group-hover:scale-110 transition-transform duration-500"
            >
              <MessageSquare className="size-10 text-[#212529]" />
            </div>
            <div className="absolute -bottom-2 -right-2 size-8 bg-[var(--secondary-accent)] rounded-xl shadow-lg flex items-center justify-center text-[#F8F9FA] border-4 border-[var(--bg)]">
              <Sparkles className="size-4" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h2 className="text-5xl font-extrabold tracking-tighter font-display">Welcome to chatly✦</h2>
          <p className="text-[var(--text-muted)] text-base font-light leading-relaxed max-w-sm mx-auto">
            Select a conversation from the sidebar to start chatting. Secure, fast, and built for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
