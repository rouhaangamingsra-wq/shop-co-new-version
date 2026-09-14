import { useEffect, useState } from "react";
import { Search, Trash2, Pencil, X, UserCircle } from "lucide-react";
import Card from "../components/Card";
import { api } from "../data/api";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const load = () => api.getUsers().then(setUsers).catch(() => []);
  useEffect(() => { load(); }, []);

  const customers = users.filter((u) => u.role !== "admin");
  const filtered = customers.filter(
    (u) => u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase())
  );

  const openEdit = (u) => { setForm(u); setEditing(u.id); };
  const close = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    await api.updateUser(editing, form);
    close();
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this customer?")) return;
    await api.deleteUser(id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center rounded-lg border border-navy-border bg-navy-card px-3 py-2">
        <Search size={16} className="text-brand-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers…" className="ml-2 w-48 bg-transparent text-sm text-white outline-none placeholder-brand-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((u) => (
          <Card key={u.id}>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-purple text-lg font-bold text-white">{u.name?.[0]}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{u.name}</p>
                <p className="truncate text-xs text-brand-muted">{u.email}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-navy-bg p-3">
                <p className="text-lg font-bold text-white">{u.orders}</p>
                <p className="text-xs text-brand-muted">Orders</p>
              </div>
              <div className="rounded-lg bg-navy-bg p-3">
                <p className="text-lg font-bold text-white">${u.spent}</p>
                <p className="text-xs text-brand-muted">Spent</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(u)} className="flex-1 rounded-lg border border-navy-border py-2 text-xs font-medium text-brand-text hover:bg-white/5">
                <Pencil size={14} className="mr-1 inline" /> Edit
              </button>
              <button onClick={() => remove(u.id)} className="rounded-lg border border-navy-border px-3 text-xs text-brand-muted hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </Card>
        ))}
        {!filtered.length && (
          <Card className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
            <UserCircle size={48} className="text-brand-muted opacity-30" />
            <div>
              <p className="text-sm font-medium text-brand-muted">No customers yet</p>
              <p className="text-xs text-brand-muted mt-1">When customers sign up on the storefront, they will appear here.</p>
            </div>
          </Card>
        )}
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md rounded-2xl border border-navy-border bg-navy-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Edit Customer</h2>
              <button type="button" onClick={close} className="text-brand-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.orders} onChange={(e) => setForm({ ...form, orders: Number(e.target.value) })} placeholder="Orders" className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
                <input type="number" value={form.spent} onChange={(e) => setForm({ ...form, spent: Number(e.target.value) })} placeholder="Spent" className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              </div>
            </div>
            <button type="submit" className="mt-5 w-full rounded-lg bg-brand-purple py-2.5 text-sm font-semibold text-white hover:brightness-110">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
