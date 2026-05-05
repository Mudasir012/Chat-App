import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[var(--bg)]">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 border-4 border-[var(--border)] flex items-center
             justify-center animate-bounce bg-[var(--text)]"
            >
              <MessageSquare className="w-8 h-8 text-[var(--bg)]" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[var(--accent)] border-2 border-[var(--border)]" />
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-4xl font-black uppercase tracking-tighter">Welcome to ChatApp</h2>
        <p className="text-[var(--text)] opacity-60 font-mono text-sm uppercase">
          Select a conversation from the sidebar to start chatting in real-time.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
