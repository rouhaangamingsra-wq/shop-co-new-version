import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, User as UserIcon, ShieldCheck } from "lucide-react";
import { customerLogin, customerSignup } from "../data/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("next") || "/checkout";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = mode === "login"
      ? await customerLogin(email, password)
      : await customerSignup(name, email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    loginAs(res.user);
    navigate(redirectTo);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16">
      {/* Admin button — top-right corner, only on this page */}
      <Link
        to="/admin"
        className="fixed right-4 top-4 z-50 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:border-gray-900 hover:text-black"
      >
        <ShieldCheck size={14} /> Admin Panel
      </Link>

      <div className="w-full rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-black text-white">
            {mode === "login" ? <Lock size={20} /> : <UserIcon size={20} />}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {mode === "login" ? "Sign in to continue to checkout" : "Join Shop Co to place orders"}
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <div className="mt-1.5 flex items-center rounded-xl border border-gray-200 px-3">
                <UserIcon size={16} className="text-gray-400" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
                />
              </div>
            </label>
          )}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <div className="mt-1.5 flex items-center rounded-xl border border-gray-200 px-3">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <div className="mt-1.5 flex items-center rounded-xl border border-gray-200 px-3">
              <Lock size={16} className="text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
              />
            </div>
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "PLEASE WAIT..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          {mode === "login" ? "New to Shop Co?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="font-semibold text-black underline"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <div className="mt-4 rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-500">
          Demo customer: <span className="font-medium text-gray-700">alex.carter@example.com</span> / <span className="font-medium text-gray-700">customer123</span>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <Link to="/" className="hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
