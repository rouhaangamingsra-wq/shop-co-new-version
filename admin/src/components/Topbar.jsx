import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Topbar({ title, onMenu }) {
  const { admin } = useAdmin();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-border bg-navy-bg px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden text-brand-text" aria-label="Open sidebar">
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-white sm:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center rounded-lg border border-navy-border bg-navy-card px-3 py-2 sm:flex">
          <Search size={16} className="text-brand-muted" />
          <input
            placeholder="Search…"
            className="ml-2 w-40 bg-transparent text-sm text-brand-text outline-none placeholder-brand-muted"
          />
        </div>
        <button className="relative text-brand-text" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand-purple" />
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-purple text-sm font-bold text-white">
            {(admin?.email || "A")[0].toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white">Admin</div>
            <div className="text-xs text-brand-muted">{admin?.email || "admin.shopco@gmail.com"}</div>
          </div>
          <ChevronDown size={16} className="hidden text-brand-muted sm:block" />
        </div>
      </div>
    </header>
  );
}
