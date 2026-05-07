import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";

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
    <div className="h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full bg-base-100 p-8 border-4 border-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
            group-hover:bg-primary/20 transition-colors"
            >
              <Lock className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-black uppercase italic">Reset Password</h1>
            <p className="text-base-content/60 font-bold">Set your new password below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-black uppercase">New Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full font-bold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-black uppercase">Confirm New Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full font-bold"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full font-black uppercase italic" disabled={isCheckingAuth}>
            {isCheckingAuth ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
