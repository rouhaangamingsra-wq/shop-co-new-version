import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { adminLogin } from "../data/api";

export default function AdminLogin() {
  // Prefilled defaults so you can just press SIGN IN.
  const [email, setEmail] = useState("admin.shopco@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await adminLogin(email, password);
    setLoading(false);
    if (res?.isAdmin) {
      localStorage.setItem("shopco_admin", JSON.stringify({ email }));
      window.location.href = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
    } else {
      setError(res?.error || "Access denied. Invalid admin credentials.");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-20">
      <div className="w-full rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-black text-white">
            <Lock size={20} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to the ShopCo admin dashboard</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <div className="mt-1.5 flex items-center rounded-xl border border-gray-200 px-3">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin.shopco@gmail.com"
                className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
            />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "PLEASE WAIT..." : "SIGN IN"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-400">
          Prefilled — just press SIGN IN. Admin: admin.shopco@gmail.com / 123456789
        </p>
      </div>
    </div>
  );
}
