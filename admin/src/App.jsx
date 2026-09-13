import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Placeholder from "./pages/Placeholder";

const titles = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/invoice": "Invoice",
  "/crm": "CRM",
  "/blog": "Blog",
  "/statistics": "Statistics",
  "/data": "Data",
  "/chart": "Chart",
  "/users": "Users",
  "/customers": "Customers",
  "/orders": "Orders",
  "/products": "Products",
  "/categories": "Categories",
  "/settings": "Settings",
};

function Shell() {
  const { admin } = useAdmin();
  const location = useLocation();
  const [sidebar, setSidebar] = useState(false);

  if (!admin) return <Login />;

  const title = titles[location.pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-navy-bg">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenu={() => setSidebar(true)} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Placeholder title="Analytics" />} />
            <Route path="/invoice" element={<Placeholder title="Invoice" />} />
            <Route path="/crm" element={<Placeholder title="CRM" />} />
            <Route path="/blog" element={<Placeholder title="Blog" />} />
            <Route path="/statistics" element={<Placeholder title="Statistics" />} />
            <Route path="/data" element={<Placeholder title="Data" />} />
            <Route path="/chart" element={<Placeholder title="Chart" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <Shell />
    </AdminProvider>
  );
}
