import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

export default function MobileFilter({ open, onClose, filters, setFilters, onReset, onApply }) {
  return (
    <div className={`lg:hidden ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">FILTER & SORT</h3>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <div className="mt-5 flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-700"
          >
            RESET
          </button>
          <button
            onClick={onApply}
            className="flex-1 rounded-full bg-black py-3 text-sm font-semibold text-white"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
}
