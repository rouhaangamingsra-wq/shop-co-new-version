import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { allCategories, allColors, allSizes, dressStyles } from "../data/products";

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-gray-900"
      >
        {title}
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, setFilters }) {
  const toggle = (key, value) => {
    setFilters((f) => {
      const arr = f[key] || [];
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  return (
    <aside className="w-full">
      <Section title="Categories">
        <div className="space-y-2">
          {allCategories.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filters.categories?.includes(c) || false}
                onChange={() => toggle("categories", c)}
                className="h-4 w-4 rounded border-gray-300 accent-black"
              />
              {c}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <input
          type="range"
          min="0"
          max="500"
          value={filters.maxPrice || 500}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-black"
        />
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <span>${filters.maxPrice || 500}</span>
        </div>
      </Section>

      <Section title="Colors">
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => {
            const active = filters.colors?.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggle("colors", c.name)}
                aria-label={c.name}
                className={`h-7 w-7 rounded-full border transition ${
                  active ? "ring-2 ring-black ring-offset-2" : "border-gray-200"
                }`}
                style={{ background: c.hex }}
              />
            );
          })}
        </div>
      </Section>

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => {
            const active = filters.sizes?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle("sizes", s)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  active ? "border-black bg-black text-white" : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Dress Style" defaultOpen={false}>
        <div className="space-y-2">
          {dressStyles.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filters.dressStyles?.includes(d) || false}
                onChange={() => toggle("dressStyles", d)}
                className="h-4 w-4 rounded border-gray-300 accent-black"
              />
              {d}
            </label>
          ))}
        </div>
      </Section>
    </aside>
  );
}
