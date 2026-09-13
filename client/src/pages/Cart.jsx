import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CartItem from "../components/CartItem";
import Breadcrumbs from "../components/Breadcrumbs";
import { useShop } from "../context/ShopContext";

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useShop();
  const navigate = useNavigate();
  const discount = cartTotal > 0 ? Math.round(cartTotal * 0.1) : 0;
  const delivery = cart.length > 0 ? 15 : 0;
  const total = cartTotal - discount + delivery;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">YOUR CART</h1>

      {cart.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-gray-50 p-12 text-center">
          <p className="text-sm text-gray-500">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {cart.map((item) => (
              <CartItem key={item.key} item={item} onRemove={removeFromCart} onQty={updateQty} />
            ))}
            <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          <aside className="h-fit rounded-3xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">${cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discount (10%)</span>
                <span className="font-medium text-green-600">-${discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium">${delivery}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-5 w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              GO TO CHECKOUT
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
