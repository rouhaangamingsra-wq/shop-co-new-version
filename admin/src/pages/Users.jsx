import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X } from "lucide-react";
import Card from "../components/Card";
import { api } from "../data/api";

const empty = { name: "", email: "", role: "customer", orders: 0, spent: 0 };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => api.getUsers().then(setUsers).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase())
  );

  const openNew = () => { setForm(empty); setEditing("new"); };
  const openEdit = (u) => { setForm(u); setEditing(u.id); };
  const close = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    if (editing === "new") await api.createUser(form);
    else await api.updateUser(editing, form);
    close();
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.deleteUser(id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center rounded-lg border border-navy-border bg-navy-card px-3 py-2">
          <Search size={16} className="text-brand-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" className="ml-2 w-48 bg-transparent text-sm text-white outline-none placeholder-brand-muted" />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          <Plus size={16} /> New User
        </button>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-brand-muted">
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Orders</th>
                <th className="px-5 py-4 font-medium">Spent</th>
                <th className="px-5 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-navy-border">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-purple text-sm font-bold text-white">{u.name?.[0]}</div>
                      <span className="font-medium text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-brand-muted">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${u.role === "admin" ? "bg-brand-purple/20 text-brand-purple" : "bg-navy-border text-brand-text"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-brand-text">{u.orders}</td>
                  <td className="px-5 py-4 text-brand-text">${u.spent}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(u)} className="text-brand-muted hover:text-white" aria-label="Edit"><Pencil size={16} /></button>
                      <button onClick={() => remove(u.id)} className="text-brand-muted hover:text-red-400" aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={6} className="px-5 py-8 text-center text-brand-muted">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md rounded-2xl border border-navy-border bg-navy-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing === "new" ? "New User" : "Edit User"}</h2>
              <button type="button" onClick={close} className="text-brand-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple">
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
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
