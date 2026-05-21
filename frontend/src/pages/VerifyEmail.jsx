import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Mail, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const { verifyEmail, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await verifyEmail(code);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="grid-bg" />
      <div className="orb w-[400px] h-[400px] bg-[var(--orb-1)] top-[-100px] right-[-100px]" />
      <div className="orb w-[300px] h-[300px] bg-[var(--orb-2)] bottom-[-100px] left-[-100px]" />

      <div className="max-w-md w-full bg-[var(--secondary-bg)] p-8 md:p-10 rounded-[2.5rem] border border-[var(--border)] shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm">
              <Mail className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-display">Verify Email</h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">Enter the 6-digit code sent to your email address</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl py-4 px-4 text-center text-3xl font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all uppercase"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm" 
            disabled={isCheckingAuth}
          >
            {isCheckingAuth ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
