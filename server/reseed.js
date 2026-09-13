// One-time script to clear and re-seed Firestore collections.
import { db } from "./firebase.js";

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`Cleared ${snap.size} docs from ${name}`);
}

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
    description: "Crafted from premium breathable fabric, this piece is designed for everyday comfort and timeless style. A versatile addition to your wardrobe that pairs effortlessly with your favorite essentials.",
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

async function reseed() {
  // Clear all collections
  await clearCollection("products");
  await clearCollection("users");
  await clearCollection("orders");
  await clearCollection("categories");

  // Re-seed
  const products = seedProducts();
  const users = seedUsers();
  const orders = seedOrders();
  const categories = seedCategories();

  const pBatch = db.batch();
  products.forEach((p) => pBatch.set(db.collection("products").doc(p.id), p));
  await pBatch.commit();
  console.log(`Seeded ${products.length} products`);

  const uBatch = db.batch();
  users.forEach((u) => uBatch.set(db.collection("users").doc(u.id), u));
  await uBatch.commit();
  console.log(`Seeded ${users.length} users`);

  const oBatch = db.batch();
  orders.forEach((o) => oBatch.set(db.collection("orders").doc(o.id), o));
  await oBatch.commit();
  console.log(`Seeded ${orders.length} orders`);

  const cBatch = db.batch();
  categories.forEach((c) => cBatch.set(db.collection("categories").doc(c.id), c));
  await cBatch.commit();
  console.log(`Seeded ${categories.length} categories`);

  console.log("Done! All Firestore collections re-seeded.");
  process.exit(0);
}

reseed().catch((e) => { console.error(e); process.exit(1); });
