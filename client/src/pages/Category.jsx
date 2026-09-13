import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import FilterSidebar from "../components/FilterSidebar";
import MobileFilter from "../components/MobileFilter";
import Breadcrumbs from "../components/Breadcrumbs";
import { getProducts } from "../data/api";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const emptyFilters = { categories: [], colors: [], sizes: [], dressStyles: [], maxPrice: 500 };

const categoryMap = {
  men: { label: "Men", desc: "Modern essentials and statement pieces for the contemporary man." },
  women: { label: "Women", desc: "Refined silhouettes and elevated staples for every occasion." },
  kids: { label: "Kids", desc: "Comfortable, durable, and playful pieces for everyday adventures." },
  casual: { label: "Casual", desc: "Effortless everyday wear that keeps you comfortable and stylish." },
  formal: { label: "Formal", desc: "Sharp tailoring and polished pieces for work and events." },
  party: { label: "Party", desc: "Standout looks that turn heads after dark." },
  gym: { label: "Gym", desc: "Performance-driven apparel that moves with you." },
  "t-shirts": { label: "T-Shirts", desc: "Soft, breathable tees in classic and graphic styles." },
  jeans: { label: "Jeans", desc: "Premium denim in a range of fits and washes." },
  shirts: { label: "Shirts", desc: "Crisp shirts for work, weekend, and everything between." },
  shorts: { label: "Shorts", desc: "Lightweight shorts built for warm days." },
  hoodies: { label: "Hoodies", desc: "Cozy layering pieces with a relaxed feel." },
  dresses: { label: "Dresses", desc: "From day dresses to evening statements." },
  jackets: { label: "Jackets", desc: "Outerwear that finishes every look." },
  sportswear: { label: "Sportswear", desc: "Technical fabrics and athletic cuts for training and beyond." },
};

export default function Category() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("popular");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const meta = categoryMap[category?.toLowerCase()] || { label: category, desc: "" };

  const baseList = useMemo(() => {
    const c = category?.toLowerCase();
    if (["men", "women", "kids"].includes(c)) return products;
    if (["casual", "formal", "party", "gym"].includes(c))
      return products.filter((p) => p.dressStyle?.toLowerCase() === c);
    return products.filter((p) => p.category?.toLowerCase() === c);
  }, [products, category]);

  const filtered = useMemo(() => {
    let list = [...baseList];
    if (filters.categories?.length) list = list.filter((p) => filters.categories.includes(p.category));
    if (filters.dressStyles?.length) list = list.filter((p) => filters.dressStyles.includes(p.dressStyle));
    if (filters.sizes?.length) list = list.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    list = list.filter((p) => p.price <= (filters.maxPrice || 500));
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.reverse(); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [baseList, filters, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: meta.label }]} />
      <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight">{meta.label}'S COLLECTION</h1>
      {meta.desc && <p className="mt-1 max-w-xl text-sm text-gray-500">{meta.desc}</p>}

      <div className="mt-6 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setDrawer(true)}
          className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold"
        >
          <SlidersHorizontal size={16} /> FILTER & SORT
        </button>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-gray-300 px-4 py-2 text-sm">
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>
        <div>
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <span className="text-sm text-gray-500">Showing 1–{filtered.length} of {filtered.length} Products</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-gray-200 px-4 py-2 text-sm">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-gray-500">No products in this category yet.</p>
          ) : (
            <ProductGrid products={filtered} columns={4} />
          )}
        </div>
      </div>

      <MobileFilter
        open={drawer}
        onClose={() => setDrawer(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={() => setFilters(emptyFilters)}
        onApply={() => setDrawer(false)}
      />
    </div>
  );
}
