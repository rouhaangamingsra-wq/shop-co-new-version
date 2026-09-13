// API helper for the customer-facing site. Falls back to local data if backend is unavailable.
import { localProducts, localCategories } from "./products";

// Use relative URL in production (Vercel), localhost in development
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

async function safeFetch(path, options) {
  try {
    const res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function getProducts(category) {
  const q = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  const data = await safeFetch(`/products${q}`);
  return data || localProducts(category);
}

export async function getProductById(id) {
  const data = await safeFetch(`/products/${id}`);
  if (data) return data;
  return localProducts().find((p) => String(p.id) === String(id)) || null;
}

export async function getCategories() {
  const data = await safeFetch(`/categories`);
  return data || localCategories();
}

export async function createOrder(order) {
  const data = await safeFetch(`/orders`, {
    method: "POST",
    body: JSON.stringify(order),
  });
  return data || { id: "ORD-" + Date.now(), ...order };
}

export async function login(email) {
  const data = await safeFetch(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return data || { email, isAdmin: email === "admin.shopco@gmail.com" };
}

// Admin login with strict email + password check.
// Returns { email, isAdmin: true } on success, or { error, isAdmin: false } on failure.
export async function adminLogin(email, password) {
  try {
    const res = await fetch(BASE + "/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Invalid admin credentials", isAdmin: false };
    return data;
  } catch (e) {
    return { error: "Unable to reach server", isAdmin: false };
  }
}

// Customer login — validates against backend users.json. Wrong credentials fail.
export async function customerLogin(email, password) {
  try {
    const res = await fetch(BASE + "/auth/customer-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Invalid email or password" };
    return { user: data.user };
  } catch (e) {
    return { error: "Unable to reach server" };
  }
}

// Customer signup — creates a new customer account.
export async function customerSignup(name, email, password) {
  try {
    const res = await fetch(BASE + "/auth/customer-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Sign up failed" };
    return { user: data.user };
  } catch (e) {
    return { error: "Unable to reach server" };
  }
}
