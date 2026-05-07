import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, isCheckingAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full bg-base-100 p-8 border-4 border-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-4">
          <Link to="/signin" className="flex items-center gap-2 text-primary font-bold hover:underline">
            <ArrowLeft className="size-4" /> Back to Sign In
          </Link>
        </div>
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
            group-hover:bg-primary/20 transition-colors"
            >
              <Mail className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-black uppercase italic">Forgot Password</h1>
            <p className="text-base-content/60 font-bold">Enter your email to receive a reset link</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-black uppercase">Email Address</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full font-bold"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full font-black uppercase italic" disabled={isCheckingAuth}>
            {isCheckingAuth ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
