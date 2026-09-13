import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X, Upload } from "lucide-react";
import Card from "../components/Card";
import { api } from "../data/api";

const allCategories = ["T-Shirts", "Jeans", "Shirts", "Shorts", "Hoodies", "Dresses", "Jackets", "Sportswear"];
const dressStyles = ["Casual", "Formal", "Party", "Gym"];
const colors = ["#111827", "#FFFFFF", "#9CA3AF", "#7C3AED", "#DC2626", "#0EA5E9"];
const sizes = ["Small", "Medium", "Large", "X-Large"];

const empty = {
  name: "",
  category: "T-Shirts",
  price: 0,
  oldPrice: 0,
  rating: 4.5,
  reviews: 0,
  colors,
  sizes,
  dressStyle: "Casual",
  images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80"],
  description: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);

  const load = () => api.getProducts().then(setProducts).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()));

  const openNew = () => { setForm(empty); setEditing("new"); };
  const openEdit = (p) => { setForm(p); setEditing(p.id); };
  const close = () => setEditing(null);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      const url = res.url.startsWith("http") ? res.url : `http://localhost:4000${res.url}`;
      setForm((f) => ({ ...f, images: [url, ...(f.images || [])] }));
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice || 0),
      discount: form.oldPrice > 0 ? Math.round((1 - form.price / form.oldPrice) * 100) : 0,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
    };
    if (editing === "new") await api.createProduct(payload);
    else await api.updateProduct(editing, payload);
    close();
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.deleteProduct(id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center rounded-lg border border-navy-border bg-navy-card px-3 py-2">
          <Search size={16} className="text-brand-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="ml-2 w-48 bg-transparent text-sm text-white outline-none placeholder-brand-muted" />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          <Plus size={16} /> New Product
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((p) => (
          <Card key={p.id} className="p-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-navy-bg">
              <img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 flex gap-1">
                <button onClick={() => openEdit(p)} className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white hover:bg-black/70"><Pencil size={14} /></button>
                <button onClick={() => remove(p.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white hover:bg-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="px-1 pt-3">
              <p className="truncate text-sm font-semibold text-white">{p.name}</p>
              <p className="text-xs text-brand-muted">{p.category}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-bold text-white">${p.price}</span>
                {p.discount > 0 && <span className="text-xs text-green-400">-{p.discount}%</span>}
              </div>
            </div>
          </Card>
        ))}
        {!filtered.length && <p className="text-brand-muted">No products found.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-navy-border bg-navy-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing === "new" ? "New Product" : "Edit Product"}</h2>
              <button type="button" onClick={close} className="text-brand-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" required className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple">
                  {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={form.dressStyle} onChange={(e) => setForm({ ...form, dressStyle: e.target.value })} className="rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple">
                  {dressStyles.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" required className="rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
                <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Old price" className="rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
                <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="Rating" className="rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
                <input type="number" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} placeholder="Reviews" className="rounded-lg border border-navy-border bg-navy-bg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple" />
              </div>

              <div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-navy-border bg-navy-bg py-4 text-sm text-brand-muted hover:border-brand-purple">
                  <Upload size={16} /> {uploading ? "Uploading…" : "Upload image"}
                  <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                </label>
                {form.images?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="h-14 w-14 overflow-hidden rounded-lg bg-navy-bg">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="mt-5 w-full rounded-lg bg-brand-purple py-2.5 text-sm font-semibold text-white hover:brightness-110">Save Product</button>
          </form>
        </div>
      )}
    </div>
  );
}
