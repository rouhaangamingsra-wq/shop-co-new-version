import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X } from "lucide-react";
import Card from "../components/Card";
import { api } from "../data/api";

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusColors = {
  Pending: "bg-amber-500/15 text-amber-400",
  Processing: "bg-blue-500/15 text-blue-400",
  Shipped: "bg-purple-500/15 text-purple-400",
  Delivered: "bg-green-500/15 text-green-400",
  Cancelled: "bg-red-500/15 text-red-400",
};

const empty = { customer: "", email: "", items: 1, total: 0, status: "Pending" };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => api.getOrders().then(setOrders).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(
    (o) => o.customer?.toLowerCase().includes(query.toLowerCase()) || o.id?.toLowerCase().includes(query.toLowerCase())
  );

  const openNew = () => { setForm(empty); setEditing("new"); };
  const openEdit = (o) => { setForm(o); setEditing(o.id); };
  const close = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    if (editing === "new") {
      await api.createOrder(form);
    } else {
      await api.updateOrder(editing, form);
    }
    close();
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this order?")) return;
    await api.deleteOrder(id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center rounded-lg border border-navy-border bg-navy-card px-3 py-2">
          <Search size={16} className="text-brand-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders…"
            className="ml-2 w-48 bg-transparent text-sm text-white outline-none placeholder-brand-muted"
          />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          <Plus size={16} /> New Order
        </button>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-brand-muted">
                <th className="px-5 py-4 font-medium">Order ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Items</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-navy-border">
                  <td className="px-5 py-4 font-medium text-white">{o.id}</td>
                  <td className="px-5 py-4 text-brand-text">{o.customer}</td>
                  <td className="px-5 py-4 text-brand-muted">{o.email}</td>
                  <td className="px-5 py-4 text-brand-text">{o.items}</td>
                  <td className="px-5 py-4 text-brand-text">${o.total}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[o.status] || ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(o)} className="text-brand-muted hover:text-white" aria-label="Edit"><Pencil size={16} /></button>
                      <button onClick={() => remove(o.id)} className="text-brand-muted hover:text-red-400" aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={7} className="px-5 py-8 text-center text-brand-muted">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
            className="w-full max-w-md rounded-2xl border border-navy-border bg-navy-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing === "new" ? "New Order" : `Edit ${editing}`}</h2>
              <button type="button" onClick={close} className="text-brand-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Customer name" required className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.items} onChange={(e) => setForm({ ...form, items: Number(e.target.value) })} placeholder="Items" className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
                <input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} placeholder="Total" className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple">
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="mt-5 w-full rounded-lg bg-brand-purple py-2.5 text-sm font-semibold text-white hover:brightness-110">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
