import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load("shopco_user", null));

  useEffect(() => {
    if (user) localStorage.setItem("shopco_user", JSON.stringify(user));
    else localStorage.removeItem("shopco_user");
  }, [user]);

  const loginAs = useCallback((u) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, loginAs, logout, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
