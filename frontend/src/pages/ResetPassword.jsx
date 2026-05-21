import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isCheckingAuth } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    const success = await resetPassword(token, password);
    if (success) {
      navigate("/signin");
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
              <Lock className="size-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-display">Reset Password</h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">Set your new strong password below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)]" />
              <input
                type="password"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all font-semibold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)]" />
              <input
                type="password"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all font-semibold"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm" 
            disabled={isCheckingAuth}
          >
            {isCheckingAuth ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
