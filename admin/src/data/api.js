// Admin API helper
const BASE = "http://localhost:4000/api";

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const api = {
  // Products
  getProducts: () => req("/products"),
  createProduct: (p) => req("/products", { method: "POST", body: JSON.stringify(p) }),
  updateProduct: (id, p) => req(`/products/${id}`, { method: "PUT", body: JSON.stringify(p) }),
  deleteProduct: (id) => req(`/products/${id}`, { method: "DELETE" }),
  // Categories
  getCategories: () => req("/categories"),
  createCategory: (c) => req("/categories", { method: "POST", body: JSON.stringify(c) }),
  updateCategory: (id, c) => req(`/categories/${id}`, { method: "PUT", body: JSON.stringify(c) }),
  deleteCategory: (id) => req(`/categories/${id}`, { method: "DELETE" }),
  // Users
  getUsers: () => req("/users"),
  createUser: (u) => req("/users", { method: "POST", body: JSON.stringify(u) }),
  updateUser: (id, u) => req(`/users/${id}`, { method: "PUT", body: JSON.stringify(u) }),
  deleteUser: (id) => req(`/users/${id}`, { method: "DELETE" }),
  // Orders
  getOrders: () => req("/orders"),
  createOrder: (o) => req("/orders", { method: "POST", body: JSON.stringify(o) }),
  updateOrder: (id, o) => req(`/orders/${id}`, { method: "PUT", body: JSON.stringify(o) }),
  deleteOrder: (id) => req(`/orders/${id}`, { method: "DELETE" }),
  // Stats
  getStats: () => req("/stats"),
  // Auth
  login: (email) => req("/auth/login", { method: "POST", body: JSON.stringify({ email }) }),
  // Image upload
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return fetch(`${BASE}/upload`, { method: "POST", body: fd }).then((r) => r.json());
  },
};
