import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "dotenv/config";
import { db } from "./firebase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------- Firestore collection helpers ----------
async function getAll(collection) {
  const snap = await db.collection(collection).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
async function getById(collection, id) {
  const doc = await db.collection(collection).doc(String(id)).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}
async function createDoc(collection, id, data) {
  await db.collection(collection).doc(String(id)).set(data);
  return { id: String(id), ...data };
}
async function updateDoc(collection, id, data) {
  const ref = db.collection(collection).doc(String(id));
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update(data);
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
}
async function deleteDoc(collection, id) {
  await db.collection(collection).doc(String(id)).delete();
}
async function queryByField(collection, field, value) {
  const snap = await db.collection(collection).where(field, "==", value).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------- Seed Firestore on first run ----------
async function seedFirestore() {
  const productsSnap = await db.collection("products").limit(1).get();
  if (productsSnap.empty) {
    const products = seedProducts();
    const batch = db.batch();
    products.forEach((p) => batch.set(db.collection("products").doc(p.id), p));
    await batch.commit();
    console.log(`Seeded ${products.length} products to Firestore`);
  }

  const usersSnap = await db.collection("users").limit(1).get();
  if (usersSnap.empty) {
    const users = seedUsers();
    const batch = db.batch();
    users.forEach((u) => batch.set(db.collection("users").doc(u.id), u));
    await batch.commit();
    console.log(`Seeded ${users.length} users to Firestore`);
  }

  const ordersSnap = await db.collection("orders").limit(1).get();
  if (ordersSnap.empty) {
    const orders = seedOrders();
    const batch = db.batch();
    orders.forEach((o) => batch.set(db.collection("orders").doc(o.id), o));
    await batch.commit();
    console.log(`Seeded ${orders.length} orders to Firestore`);
  }

  const catsSnap = await db.collection("categories").limit(1).get();
  if (catsSnap.empty) {
    const cats = seedCategories();
    const batch = db.batch();
    cats.forEach((c) => batch.set(db.collection("categories").doc(c.id), c));
    await batch.commit();
    console.log(`Seeded ${cats.length} categories to Firestore`);
  }
}

// ---------- Multer image upload ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

// ---------- Auth ----------
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin.shopco@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456789";

// Admin login (strict email + password check)
app.post("/api/auth/admin-login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ email, isAdmin: true });
  }
  return res.status(401).json({ error: "Invalid admin credentials", isAdmin: false });
});

// Backwards-compatible legacy login (still used by any old callers)
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body || {};
  const isAdmin = email === ADMIN_EMAIL;
  res.json({ email: email || "guest@shopco.com", isAdmin });
});

// Customer login (validates against Firestore users collection)
app.post("/api/auth/customer-login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    const snap = await db.collection("users").where("email", "==", String(email).toLowerCase()).limit(1).get();
    if (snap.empty) return res.status(401).json({ error: "Invalid email or password" });
    const user = { id: snap.docs[0].id, ...snap.docs[0].data() };
    if (user.password !== password) return res.status(401).json({ error: "Invalid email or password" });
    const { password: _pw, ...safe } = user;
    res.json({ user: safe });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Customer signup (creates a new customer account in Firestore)
app.post("/api/auth/customer-signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password required" });
  try {
    const existing = await db.collection("users").where("email", "==", String(email).toLowerCase()).limit(1).get();
    if (!existing.empty) return res.status(409).json({ error: "An account with this email already exists" });
    const id = Date.now().toString();
    const u = {
      name,
      email: String(email).toLowerCase(),
      password,
      role: "customer",
      orders: 0,
      spent: 0,
      createdAt: new Date().toISOString(),
    };
    await createDoc("users", id, u);
    const { password: _pw, ...safe } = { id, ...u };
    res.status(201).json({ user: safe });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Products ----------
app.get("/api/products", async (req, res) => {
  try {
    let products = await getAll("products");
    const { category, search } = req.query;
    if (category && category !== "all") {
      products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const p = await getById("products", req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const id = Date.now().toString();
    const p = { createdAt: new Date().toISOString(), ...req.body };
    await createDoc("products", id, p);
    res.status(201).json({ id, ...p });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await updateDoc("products", req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await deleteDoc("products", req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Image upload for products
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ---------- Categories ----------
app.get("/api/categories", async (req, res) => {
  try {
    res.json(await getAll("categories"));
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/categories", async (req, res) => {
  try {
    const id = Date.now().toString();
    const c = { ...req.body };
    await createDoc("categories", id, c);
    res.status(201).json({ id, ...c });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.put("/api/categories/:id", async (req, res) => {
  try {
    const updated = await updateDoc("categories", req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.delete("/api/categories/:id", async (req, res) => {
  try {
    await deleteDoc("categories", req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Users ----------
app.get("/api/users", async (req, res) => {
  try {
    res.json(await getAll("users"));
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/users", async (req, res) => {
  try {
    const id = Date.now().toString();
    const u = { createdAt: new Date().toISOString(), ...req.body };
    await createDoc("users", id, u);
    res.status(201).json({ id, ...u });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.put("/api/users/:id", async (req, res) => {
  try {
    const updated = await updateDoc("users", req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.delete("/api/users/:id", async (req, res) => {
  try {
    await deleteDoc("users", req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Orders ----------
app.get("/api/orders", async (req, res) => {
  try {
    res.json(await getAll("orders"));
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/orders", async (req, res) => {
  try {
    const id = "ORD-" + Date.now();
    const o = { createdAt: new Date().toISOString(), status: "Pending", ...req.body };
    await createDoc("orders", id, o);
    res.status(201).json({ id, ...o });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.put("/api/orders/:id", async (req, res) => {
  try {
    const updated = await updateDoc("orders", req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await deleteDoc("orders", req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Dashboard stats ----------
app.get("/api/stats", async (req, res) => {
  try {
    const [products, users, orders] = await Promise.all([
      getAll("products"),
      getAll("users"),
      getAll("orders"),
    ]);
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    res.json({
      products: products.length,
      users: users.length,
      orders: orders.length,
      revenue,
      recentOrders: orders.slice(-5).reverse(),
      recentUsers: users.slice(-5).reverse(),
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Seed data functions ----------
function seedProducts() {
  const img = (url) => `${url}?auto=format&fit=crop&w=600&q=80`;
  const U = (u) => `https://images.unsplash.com/${u}`;
  const base = [
    { name: "T-SHIRT WITH TAPE DETAILS", category: "T-Shirts", price: 120, oldPrice: 150, rating: 4.5, reviews: 532, dressStyle: "Casual", img: U("photo-1581655353564-df123a1eb820") },
    { name: "SKINNY FIT JEANS", category: "Jeans", price: 240, oldPrice: 260, rating: 4.3, reviews: 341, dressStyle: "Casual", img: U("photo-1571933054329-fac6a78a6e36") },
    { name: "CHECKERED SHIRT", category: "Shirts", price: 180, oldPrice: 0, rating: 4.2, reviews: 124, dressStyle: "Formal", img: U("photo-1770058428099-f2d64ab34006") },
    { name: "SLEEVE STRIPED T-SHIRT", category: "T-Shirts", price: 130, oldPrice: 160, rating: 4.7, reviews: 289, dressStyle: "Casual", img: U("photo-1521572163474-6864f9cf17ab") },
    { name: "VERTICAL STRIPED SHIRT", category: "Shirts", price: 210, oldPrice: 250, rating: 4.6, reviews: 198, dressStyle: "Formal", img: U("photo-1760626688574-5c303e7bd371") },
    { name: "COURAGE GRAPHIC T-SHIRT", category: "T-Shirts", price: 145, oldPrice: 0, rating: 4.4, reviews: 410, dressStyle: "Casual", img: U("photo-1605949405965-d49ada3f9189") },
    { name: "LOOSE FIT BERMUDA SHORTS", category: "Shorts", price: 90, oldPrice: 120, rating: 4.1, reviews: 87, dressStyle: "Casual", img: U("photo-1553068551-db8745da0850") },
    { name: "FADED SKINNY JEANS", category: "Jeans", price: 220, oldPrice: 280, rating: 4.5, reviews: 156, dressStyle: "Casual", img: U("photo-1552252059-9d77e4059ad1") },
    { name: "ONE LIFE GRAPHIC T-SHIRT", category: "T-Shirts", price: 120, oldPrice: 150, rating: 4.5, reviews: 532, dressStyle: "Casual", img: U("photo-1571455786673-9d9d6c194f90") },
    { name: "OVERSIZED HOODIE", category: "Hoodies", price: 195, oldPrice: 240, rating: 4.8, reviews: 612, dressStyle: "Casual", img: U("photo-1620799140188-3b2a02fd9a77") },
    { name: "SUMMER DRESS", category: "Dresses", price: 165, oldPrice: 0, rating: 4.6, reviews: 233, dressStyle: "Party", img: U("photo-1762154057377-cc9d3dd6900c") },
    { name: "DENIM JACKET", category: "Jackets", price: 280, oldPrice: 320, rating: 4.7, reviews: 311, dressStyle: "Casual", img: U("photo-1611312449408-fcece27cdbb7") },
    { name: "SPORTS PERFORMANCE TEE", category: "Sportswear", price: 75, oldPrice: 95, rating: 4.3, reviews: 178, dressStyle: "Gym", img: U("photo-1593419528756-3cdfa1615b86") },
    { name: "EVENING PARTY DRESS", category: "Dresses", price: 320, oldPrice: 380, rating: 4.9, reviews: 145, dressStyle: "Party", img: U("photo-1753192104240-209f3fb568ef") },
    { name: "CLASSIC FORMAL SHIRT", category: "Shirts", price: 140, oldPrice: 0, rating: 4.4, reviews: 267, dressStyle: "Formal", img: U("photo-1758259409259-32e3bd661a4a") },
    { name: "TRACK PANTS", category: "Sportswear", price: 110, oldPrice: 130, rating: 4.2, reviews: 134, dressStyle: "Gym", img: U("photo-1600696491085-19dbbeb4f8c1") },
  ];
  const colors = ["#111827", "#FFFFFF", "#9CA3AF", "#7C3AED", "#DC2626", "#0EA5E9"];
  const sizes = ["Small", "Medium", "Large", "X-Large"];
  return base.map((b, i) => ({
    id: String(i + 1),
    name: b.name,
    category: b.category,
    price: b.price,
    oldPrice: b.oldPrice,
    discount: b.oldPrice ? Math.round((1 - b.price / b.oldPrice) * 100) : 0,
    rating: b.rating,
    reviews: b.reviews,
    colors,
    sizes,
    dressStyle: b.dressStyle,
    images: [img(b.img), img(b.img), img(b.img), img(b.img)],
    description:
      "Crafted from premium breathable fabric, this piece is designed for everyday comfort and timeless style. A versatile addition to your wardrobe that pairs effortlessly with your favorite essentials.",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

function seedUsers() {
  const names = ["Sarah M.", "Alex Carter", "Jamie Lin", "Diego Morales", "Priya Patel", "Liam O'Brien", "Noah Kim", "Emma Wilson", "Olivia Brown", "Lucas Silva"];
  return names.map((n, i) => ({
    id: String(i + 1),
    name: n,
    email: n.toLowerCase().replace(/[^a-z]/g, ".") + "@example.com",
    password: "customer123",
    role: i === 0 ? "admin" : "customer",
    orders: Math.floor(Math.random() * 12) + 1,
    spent: Math.floor(Math.random() * 4000) + 200,
    createdAt: new Date(Date.now() - i * 5 * 86400000).toISOString(),
  }));
}

function seedOrders() {
  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  return Array.from({ length: 12 }).map((_, i) => ({
    id: "ORD-" + (1000 + i),
    customer: ["Sarah M.", "Alex Carter", "Jamie Lin", "Diego Morales", "Priya Patel"][i % 5],
    email: ["sarah.m", "alex.carter", "jamie.lin", "diego.morales", "priya.patel"][i % 5] + "@example.com",
    items: Math.floor(Math.random() * 5) + 1,
    total: Math.floor(Math.random() * 500) + 60,
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - i * 2 * 86400000).toISOString(),
  }));
}

function seedCategories() {
  const U = (u) => `https://images.unsplash.com/${u}?auto=format&fit=crop&w=600&q=80`;
  return [
    { id: "1", name: "Casual", image: U("photo-1624373607006-348f61ea2d76") },
    { id: "2", name: "Formal", image: U("photo-1758259409259-32e3bd661a4a") },
    { id: "3", name: "Party", image: U("photo-1753192104240-209f3fb568ef") },
    { id: "4", name: "Gym", image: U("photo-1635929171657-ccb333d714f5") },
  ];
}

// ---------- Start server (after seeding Firestore) ----------
const PORT = process.env.PORT || 4000;
seedFirestore()
  .then(() => {
    app.listen(PORT, () => console.log(`ShopCo API running on http://localhost:${PORT} (Firestore: shopcoanddashbord)`));
  })
  .catch((e) => {
    console.error("Failed to seed Firestore:", e.message);
    app.listen(PORT, () => console.log(`ShopCo API running on http://localhost:${PORT} (Firestore seed failed — check credentials)`));
  });
