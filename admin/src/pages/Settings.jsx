import { useState } from "react";
import Card from "../components/Card";
import { useAdmin } from "../context/AdminContext";

export default function Settings() {
  const { admin, logout } = useAdmin();
  const [name, setName] = useState("ShopCo Admin");
  const [email, setEmail] = useState(admin?.email || "admin.shopco@gmail.com");
  const [saved, setSaved] = useState(false);

  const save = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <h2 className="text-base font-semibold text-white">Profile Settings</h2>
        <form onSubmit={save} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm text-brand-text">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
          </label>
          <label className="block">
            <span className="text-sm text-brand-text">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
          </label>
          <div className="flex items-center gap-3">
            <button type="submit" className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110">Save Changes</button>
            {saved && <span className="text-sm text-green-400">Saved!</span>}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-white">Store Preferences</h2>
        <div className="mt-4 space-y-3">
          {["Email notifications", "Order alerts", "Low stock warnings", "Weekly reports"].map((p, i) => (
            <label key={p} className="flex items-center justify-between text-sm text-brand-text">
              {p}
              <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4 accent-brand-purple" />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-white">Session</h2>
        <p className="mt-2 text-sm text-brand-muted">You are signed in as {admin?.email}</p>
        <button onClick={logout} className="mt-4 rounded-lg border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10">
          Logout
        </button>
      </Card>
    </div>
  );
}
