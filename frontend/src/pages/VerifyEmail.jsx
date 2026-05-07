import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

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
    <div className="h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full bg-base-100 p-8 border-4 border-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
            group-hover:bg-primary/20 transition-colors"
            >
              <Mail className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-black uppercase italic">Verify Email</h1>
            <p className="text-base-content/60 font-bold">Enter the 6-digit code sent to your email</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <input
              type="text"
              className="input input-bordered w-full font-black text-center text-2xl tracking-[0.5em]"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full font-black uppercase italic" disabled={isCheckingAuth}>
            {isCheckingAuth ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
