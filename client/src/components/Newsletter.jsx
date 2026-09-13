import { useState } from "react";
import { Check } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Newsletter() {
  const { showToast } = useShop();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    showToast("Subscribed! Check your inbox.");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-black px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-3xl">
          STAY UPTO DATE ABOUT OUR LATEST OFFERS
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-gray-300">
          Subscribe to our newsletter and get updates about new arrivals, exclusive offers and
          special discounts.
        </p>
        <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-full border border-gray-600 bg-transparent px-5 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-white"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            <Check size={16} /> SUBSCRIBE
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </section>
  );
}
