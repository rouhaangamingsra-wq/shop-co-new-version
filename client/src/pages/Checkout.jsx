import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../data/api";

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
      />
    </label>
  );
}

export default function Checkout() {
  const { cart, cartTotal } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    address: "",
    apartment: "",
    city: "",
    country: "",
    postal: "",
    phone: "",
    card: "",
    exp: "",
    cvc: "",
  });

  // Require customer login before checkout.
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-black text-white">
            <Lock size={20} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Sign in to checkout</h1>
          <p className="mt-1 text-sm text-gray-500">You need to be signed in to place an order.</p>
          <Link
            to="/login?next=/checkout"
            className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(cartTotal * 0.1);
  const delivery = 15;
  const total = cartTotal - discount + delivery;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    await createOrder({
      customer: `${form.firstName} ${form.lastName}`.trim() || "Guest",
      email: form.email,
      items: cart.length,
      total,
      status: "Pending",
    });
    navigate("/"); // order placed (mock)
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">CHECKOUT</h1>

      {cart.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-gray-50 p-12 text-center">
          <p className="text-sm text-gray-500">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
            Browse Products
          </Link>
        </div>
      ) : (
        <form onSubmit={placeOrder} className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* Contact */}
            <section>
              <h2 className="text-base font-semibold">CONTACT INFORMATION</h2>
              <div className="mt-4">
                <Field label="Email address" type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-base font-semibold">DELIVERY ADDRESS</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="First Name" required value={form.firstName} onChange={set("firstName")} />
                <Field label="Last Name" required value={form.lastName} onChange={set("lastName")} />
                <div className="sm:col-span-2">
                  <Field label="Address" required value={form.address} onChange={set("address")} />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Apartment / Suite" value={form.apartment} onChange={set("apartment")} />
                </div>
                <Field label="City" required value={form.city} onChange={set("city")} />
                <Field label="Country" required value={form.country} onChange={set("country")} />
                <Field label="Postal Code" required value={form.postal} onChange={set("postal")} />
                <Field label="Phone" type="tel" required value={form.phone} onChange={set("phone")} />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Lock size={16} /> PAYMENT
              </h2>
              <p className="mt-1 text-xs text-gray-500">This is a demo — no real payment is processed.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Card Number" required value={form.card} onChange={set("card")} placeholder="4242 4242 4242 4242" />
                </div>
                <Field label="Expiration (MM/YY)" required value={form.exp} onChange={set("exp")} placeholder="12/28" />
                <Field label="CVC" required value={form.cvc} onChange={set("cvc")} placeholder="123" />
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-3xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {cart.map((i) => (
                <div key={i.key} className="flex items-center gap-3">
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{i.name}</p>
                    <p className="text-xs text-gray-500">Qty {i.quantity} · {i.size}</p>
                  </div>
                  <span className="text-sm font-semibold">${i.price * i.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">${cartTotal}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="font-medium text-green-600">-${discount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-medium">${delivery}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold"><span>Total</span><span>${total}</span></div>
            </div>
            <button type="submit" className="mt-5 w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800">
              PLACE ORDER
            </button>
          </aside>
        </form>
      )}
    </div>
  );
}
