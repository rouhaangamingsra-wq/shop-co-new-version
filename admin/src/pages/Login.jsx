import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Login() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(email);
    if (!ok) setError("Access denied. This account is not an admin.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-bg p-4">
      <div className="w-full max-w-md rounded-3xl border border-navy-border bg-navy-card p-8">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-purple text-white">
            <Lock size={20} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-brand-muted">Sign in to ShopCo admin dashboard</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-brand-text">Email</span>
            <div className="mt-1.5 flex items-center rounded-xl border border-navy-border bg-navy-bg px-3">
              <Mail size={16} className="text-brand-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin.shopco@gmail.com"
                className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder-brand-muted"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-text">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-navy-border bg-navy-bg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-purple"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-brand-purple py-3 text-sm font-semibold text-white transition hover:brightness-110">
            SIGN IN
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-brand-muted">Demo admin email: admin.shopco@gmail.com</p>
      </div>
    </div>
  );
}
