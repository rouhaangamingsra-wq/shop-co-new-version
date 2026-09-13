import { Link } from "react-router-dom";
import { X, Search, Heart, User, Home, ShoppingBag } from "lucide-react";

const links = [
  { label: "Men", to: "/category/men" },
  { label: "Women", to: "/category/women" },
  { label: "Kids", to: "/category/kids" },
  { label: "Collections", to: "/products" },
  { label: "New Arrivals", to: "/products" },
];

export default function MobileNavbar({ open, onClose }) {
  return (
    <div className={`lg:hidden ${open ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 max-w-[80%] bg-white p-5 shadow-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold">SHOP<span className="font-light">CO</span></span>
          <button onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="mt-5 flex items-center rounded-full border border-gray-200 px-3 py-2">
          <Search size={16} className="text-gray-500" />
          <input
            placeholder="Search products"
            className="ml-2 w-full bg-transparent text-sm outline-none"
          />
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">
            <Home size={18} /> Home
          </Link>
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={onClose}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <Link to="/cart" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">
            <ShoppingBag size={18} /> Cart
          </Link>
          <Link to="/products" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">
            <Heart size={18} /> Wishlist
          </Link>
          <Link to="/login" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">
            <User size={18} /> Sign In
          </Link>
          <Link to="/admin" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-100">
            <User size={18} /> Admin
          </Link>
        </div>
      </aside>
    </div>
  );
}
