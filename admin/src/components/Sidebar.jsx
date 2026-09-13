import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  BarChart3,
  FileText,
  Users as UsersIcon,
  Newspaper,
  ChevronDown,
  Activity,
  Database,
  LineChart,
  ShoppingCart,
  UserCog,
  Package,
  FolderTree,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

const sections = [
  {
    title: null,
    items: [
      { to: "/", label: "Default", icon: LayoutGrid, end: true },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/invoice", label: "Invoice", icon: FileText },
      { to: "/crm", label: "CRM", icon: UsersIcon },
      { to: "/blog", label: "Blog", icon: Newspaper },
    ],
  },
  {
    title: "WIDGET",
    items: [
      { to: "/statistics", label: "Statistics", icon: Activity },
      { to: "/data", label: "Data", icon: Database },
      { to: "/chart", label: "Chart", icon: LineChart },
    ],
  },
  {
    title: "APPLICATION",
    items: [
      { to: "/users", label: "Users", icon: UserCog },
      { to: "/customers", label: "Customer", icon: UsersIcon },
      { to: "/orders", label: "Order", icon: ShoppingCart },
      { to: "/products", label: "Products", icon: Package, expandable: true },
      { to: "/categories", label: "Categories", icon: FolderTree, expandable: true },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAdmin();
  const [expanded, setExpanded] = useState({});

  const toggle = (label) => setExpanded((e) => ({ ...e, [label]: !e[label] }));

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${open ? "" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed z-50 h-full w-64 shrink-0 overflow-y-auto bg-navy-sidebar border-r border-navy-border transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-purple text-white font-extrabold">S</div>
            <span className="text-lg font-bold text-white">ShopCo</span>
          </div>
          <button onClick={onClose} className="text-brand-muted lg:hidden" aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 pb-6">
          {sections.map((sec, i) => (
            <div key={i} className="mb-4">
              {sec.title && (
                <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isExp = expanded[item.label];
                return (
                  <div key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-navy-active text-brand-purple"
                            : "text-brand-text hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span className="flex-1">{item.label}</span>
                      {item.expandable && (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); toggle(item.label); }}
                          className="text-brand-muted"
                        >
                          <ChevronDown size={14} className={`transition ${isExp ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </NavLink>
                    {item.expandable && isExp && (
                      <div className="ml-9 mt-1 space-y-1 text-xs text-brand-muted">
                        <div className="rounded px-3 py-1.5 hover:text-white">All {item.label}</div>
                        <div className="rounded px-3 py-1.5 hover:text-white">Add New</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="mt-auto px-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-text hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
