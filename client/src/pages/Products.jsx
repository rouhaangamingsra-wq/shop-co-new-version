import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function Products() {
  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("popular");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
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
  }, [products, filters, sort, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "All Products" }]} />
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">All Products</h1>
      {search && <p className="mt-1 text-sm text-gray-500">Showing results for "{search}"</p>}

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
            <span className="text-sm text-gray-500">Showing {filtered.length} of {products.length} Products</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-gray-200 px-4 py-2 text-sm">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-gray-500">No products match your filters.</p>
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
