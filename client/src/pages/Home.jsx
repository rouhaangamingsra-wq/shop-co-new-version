import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import CategoryCard from "../components/CategoryCard";
import Newsletter from "../components/Newsletter";
import Rating from "../components/Rating";
import { getProducts, getCategories } from "../data/api";

const testimonials = [
  { name: "Sarah M.", text: "I absolutely love the quality and fit. The delivery was fast and everything looked exactly like the photos." },
  { name: "Alex Carter", text: "Premium feel at a fair price. The fabric is soft and the stitching is impeccable. Will buy again." },
  { name: "Jamie Lin", text: "My new favorite store. Clean designs, great packaging, and the customer support team is wonderful." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
    getCategories().then(setCategories);
  }, []);

  const newArrivals = products.slice(0, 4);
  const topSelling = products.slice(4, 8);

  return (
    <div>
      {/* HERO */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              FIND CLOTHES <br /> THAT MATCH <br /> YOUR STYLE
            </h1>
            <p className="mt-5 max-w-md text-sm text-gray-600 sm:text-base">
              Browse through our diverse range of meticulously crafted garments designed to bring
              out your individuality.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                SHOP NOW
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
              >
                EXPLORE
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
              {[
                ["200+", "International Brands"],
                ["2,000+", "High-Quality Products"],
                ["30,000+", "Happy Customers"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-xl font-extrabold sm:text-2xl">{n}</div>
                  <div className="mt-1 text-xs text-gray-500 sm:text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-3xl bg-gray-200 aspect-[4/3] lg:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1562151270-c7d22ceb586a?auto=format&fit=crop&w=1000&q=80"
                alt="Fashion hero"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">NEW ARRIVALS</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} columns={4} />
      </section>

      {/* TOP SELLING */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">TOP SELLING</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={topSelling} columns={4} />
      </section>

      {/* BROWSE BY DRESS STYLE */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
          BROWSE BY DRESS STYLE
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {categories.length > 0 ? (
            <>
              <CategoryCard category={categories[0]} className="h-56 lg:col-span-2 lg:row-span-2 lg:h-full" />
              <CategoryCard category={categories[1]} className="h-56 lg:h-64" />
              <CategoryCard category={categories[2]} className="h-56 lg:h-64" />
              <CategoryCard category={categories[3]} className="col-span-2 h-56 lg:col-span-2 lg:h-64" />
            </>
          ) : (
            <p className="text-sm text-gray-500">Loading categories…</p>
          )}
        </div>
      </section>

      {/* HAPPY CUSTOMERS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
            OUR HAPPY CUSTOMERS
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
                <Rating value={5} />
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{t.name}</span>
                  <BadgeCheck size={16} className="text-green-500" />
                </div>
                <p className="mt-2 text-sm text-gray-600">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
