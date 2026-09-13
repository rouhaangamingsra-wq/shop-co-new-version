import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import MobileNavbar from "./MobileNavbar";

const links = [
  { label: "Men", to: "/category/men" },
  { label: "Women", to: "/category/women" },
  { label: "Kids", to: "/category/kids" },
  { label: "Collections", to: "/products" },
  { label: "New Arrivals", to: "/products" },
];

export default function Navbar() {
  const { cartCount, wishlist } = useShop();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="text-xl font-extrabold tracking-tight">
              SHOP<span className="font-light">CO</span>
            </Link>
          </div>

          {/* Center: links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm font-medium text-gray-700 transition hover:text-black"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <form onSubmit={onSearch} className="hidden sm:flex items-center">
              <div className="flex items-center rounded-full border border-gray-200 px-3 py-1.5">
                <Search size={16} className="text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="ml-2 w-24 bg-transparent text-sm outline-none sm:w-32"
                />
              </div>
            </form>
            <button aria-label="Search" className="sm:hidden">
              <Search size={20} />
            </button>
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/checkout" aria-label="Account" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black">
                  <User size={20} />
                  <span className="hidden md:inline">{user.name?.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="text-xs text-gray-400 hover:text-black"
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" aria-label="Sign in" className="hidden sm:block">
                <User size={20} />
              </Link>
            )}
            <Link to="/products" aria-label="Wishlist" className="relative hidden sm:block">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>
      <MobileNavbar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
