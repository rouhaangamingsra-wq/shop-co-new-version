import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../data/api";

const AdminContext = createContext(null);
const ADMIN_EMAIL = "admin.shopco@gmail.com";

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const v = localStorage.getItem("shopco_admin");
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  });

  const login = async (email) => {
    const res = await api.login(email);
    if (res?.isAdmin) {
      const a = { email: res.email };
      localStorage.setItem("shopco_admin", JSON.stringify(a));
      setAdmin(a);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("shopco_admin");
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
