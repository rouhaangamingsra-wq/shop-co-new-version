import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import { api } from "../data/api";

const salesData = [
  { name: "Jan", sales: 4200, orders: 120 },
  { name: "Feb", sales: 5100, orders: 145 },
  { name: "Mar", sales: 4800, orders: 132 },
  { name: "Apr", sales: 6300, orders: 178 },
  { name: "May", sales: 7200, orders: 201 },
  { name: "Jun", sales: 6800, orders: 189 },
  { name: "Jul", sales: 8100, orders: 224 },
  { name: "Aug", sales: 9200, orders: 256 },
  { name: "Sep", sales: 8700, orders: 241 },
];

const statusColors = {
  Pending: "bg-amber-500/15 text-amber-400",
  Processing: "bg-blue-500/15 text-blue-400",
  Shipped: "bg-purple-500/15 text-purple-400",
  Delivered: "bg-green-500/15 text-green-400",
  Cancelled: "bg-red-500/15 text-red-400",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
    api.getProducts().then(setProducts).catch(() => {});
  }, []);

  const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={stats ? `$${stats.revenue.toLocaleString()}` : "—"} change={stats?.revenue ? "+0%" : "—"} color="#6C4DFF" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats?.orders ?? "—"} change={stats?.orders ? "+0%" : "—"} color="#0EA5E9" />
        <StatCard icon={Package} label="Products" value={stats?.products ?? "—"} change={stats?.products ? "+0%" : "—"} color="#16A34A" />
        <StatCard icon={Users} label="Customers" value={stats?.users ?? "—"} change={stats?.users ? "+0%" : "—"} color="#F59E0B" />
      </div>

      {/* Chart */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Sales Overview</h2>
            <p className="text-xs text-brand-muted">Monthly revenue and orders</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <TrendingUp size={14} /> +18.2% this year
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C4DFF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6C4DFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#303750" vertical={false} />
              <XAxis dataKey="name" stroke="#9299B5" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9299B5" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1a2240",
                  border: "1px solid #303750",
                  borderRadius: 12,
                  color: "#fff",
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#6C4DFF" strokeWidth={2} fill="url(#sales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-white">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-brand-muted">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentOrders || []).map((o) => (
                  <tr key={o.id} className="border-t border-navy-border">
                    <td className="py-3 font-medium text-white">{o.id}</td>
                    <td className="py-3 text-brand-text">{o.customer}</td>
                    <td className="py-3 text-brand-text">${o.total}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[o.status] || ""}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!stats?.recentOrders?.length && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-1 text-brand-muted">
                        <ShoppingCart size={32} className="opacity-30" />
                        <p className="text-sm">No orders yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent customers */}
        <Card>
          <h2 className="mb-4 text-base font-semibold text-white">Recent Customers</h2>
          <div className="space-y-4">
            {(stats?.recentUsers || []).map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-purple text-sm font-bold text-white">
                  {u.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{u.name}</p>
                  <p className="truncate text-xs text-brand-muted">{u.email}</p>
                </div>
                <span className="text-xs text-brand-muted">{u.orders} orders</span>
              </div>
            ))}
            {!stats?.recentUsers?.length && (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Users size={32} className="text-brand-muted opacity-30" />
                <p className="text-sm text-brand-muted">No customers yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Product performance */}
      <Card>
        <h2 className="mb-4 text-base font-semibold text-white">Product Performance</h2>
        <div className="space-y-3">
          {topProducts.map((p, i) => {
            const max = topProducts[0]?.reviews || 1;
            const pct = Math.round((p.reviews / max) * 100);
            return (
              <div key={p.id} className="flex items-center gap-4">
                <span className="w-5 text-sm text-brand-muted">{i + 1}</span>
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-navy-border">
                  <img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{p.name}</p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-navy-border">
                    <div className="h-full rounded-full bg-brand-purple" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-xs text-brand-muted">{p.reviews} reviews</span>
              </div>
            );
          })}
          {!topProducts.length && <p className="text-center text-sm text-brand-muted">Loading…</p>}
        </div>
      </Card>
    </div>
  );
}
