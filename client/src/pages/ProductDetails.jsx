import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";
import Rating from "../components/Rating";
import ProductGrid from "../components/ProductGrid";
import Breadcrumbs from "../components/Breadcrumbs";
import { useShop } from "../context/ShopContext";
import { getProductById, getProducts } from "../data/api";

const reviews = [
  { name: "Samantha D.", date: "Aug 12, 2026", text: "Soft fabric and the fit is exactly as described. My new favorite tee." },
  { name: "Marcus T.", date: "Jul 30, 2026", text: "Great quality for the price. Shipping was quick and the print is crisp." },
  { name: "Elena R.", date: "Jul 18, 2026", text: "Love the minimalist design. Goes with everything in my closet." },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getProductById(id).then((p) => {
      setProduct(p);
      setColor(p?.colors?.[0] || "#111827");
      setSize(p?.sizes?.[1] || "Medium");
      setActiveImg(0);
    });
    getProducts().then((all) => setRelated(all.filter((x) => String(x.id) !== String(id)).slice(0, 4)));
  }, [id]);

  if (!product) return <div className="py-20 text-center text-sm text-gray-500">Loading product…</div>;

  const next = () => setActiveImg((i) => (i + 1) % product.images.length);
  const prev = () => setActiveImg((i) => (i - 1 + product.images.length) % product.images.length);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: product.category, to: `/category/${product.category.toLowerCase()}` },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-3xl bg-gray-100 aspect-[4/5]">
              <img src={product.images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
              <button onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`overflow-hidden rounded-xl border-2 bg-gray-100 aspect-square ${
                    i === activeImg ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <Rating value={product.rating} />
              <span className="text-sm text-gray-500">{product.rating.toFixed(1)}/5</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-extrabold">${product.price}</span>
              {product.oldPrice > 0 && (
                <span className="text-lg text-gray-400 line-through">${product.oldPrice}</span>
              )}
              {product.discount > 0 && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                  -{product.discount}%
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-gray-600">{product.description}</p>

            {/* Colors */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">SELECT COLORS</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={`h-9 w-9 rounded-full border transition ${
                      color === c ? "ring-2 ring-black ring-offset-2" : "border-gray-200"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">SELECT SIZE</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                      size === s ? "border-black bg-black text-white" : "border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-gray-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, { size, color, quantity: qty })}
                className="flex-1 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => {
                  addToCart(product, { size, color, quantity: qty });
                  navigate("/checkout");
                }}
                className="flex-1 rounded-full border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                BUY NOW
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 text-center">
              <div className="flex flex-col items-center gap-1 text-xs text-gray-600">
                <Truck size={20} /> Free Shipping
              </div>
              <div className="flex flex-col items-center gap-1 text-xs text-gray-600">
                <ShieldCheck size={20} /> Secure Payment
              </div>
              <div className="flex flex-col items-center gap-1 text-xs text-gray-600">
                <RefreshCw size={20} /> Easy Returns
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight">CUSTOMER REVIEWS</h2>
          <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-extrabold">{product.rating.toFixed(1)}</div>
              <div>
                <Rating value={product.rating} />
                <p className="mt-1 text-xs text-gray-500">{product.reviews} reviews</p>
              </div>
            </div>
            <button className="rounded-full border border-gray-900 px-5 py-2.5 text-sm font-semibold hover:bg-gray-100">
              Write a Review
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-gray-100 p-5">
                <Rating value={5} />
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{r.name}</span>
                  <BadgeCheck size={15} className="text-green-500" />
                  <span className="text-xs text-gray-400">Verified Buyer</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{r.date}</p>
                <p className="mt-2 text-sm text-gray-600">"{r.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* You may also like */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight">YOU MIGHT ALSO LIKE</h2>
          <div className="mt-6">
            <ProductGrid products={related} columns={4} />
          </div>
        </section>
      </div>
    </div>
  );
}
