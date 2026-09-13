import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import Card from "../components/Card";
import { api } from "../data/api";

const empty = { name: "", image: "" };

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => api.getCategories().then(setCats).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing("new"); };
  const openEdit = (c) => { setForm(c); setEditing(c.id); };
  const close = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    if (editing === "new") await api.createCategory(form);
    else await api.updateCategory(editing, form);
    close();
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.deleteCategory(id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cats.map((c) => (
          <Card key={c.id} className="p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-bg">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 flex gap-1">
                <button onClick={() => openEdit(c)} className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white hover:bg-black/70"><Pencil size={14} /></button>
                <button onClick={() => remove(c.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white hover:bg-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-white">{c.name}</p>
          </Card>
        ))}
        {!cats.length && <p className="text-brand-muted">No categories found.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md rounded-2xl border border-navy-border bg-navy-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing === "new" ? "New Category" : "Edit Category"}</h2>
              <button type="button" onClick={close} className="text-brand-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" required className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              {form.image && (
                <div className="h-32 overflow-hidden rounded-lg bg-navy-bg">
                  <img src={form.image} alt="preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            <button type="submit" className="mt-5 w-full rounded-lg bg-brand-purple py-2.5 text-sm font-semibold text-white hover:brightness-110">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
