import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ShopContext = createContext(null);

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load("shopco_cart", []));
  const [wishlist, setWishlist] = useState(() => load("shopco_wishlist", []));
  const [toasts, setToasts] = useState([]);

  useEffect(() => localStorage.setItem("shopco_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("shopco_wishlist", JSON.stringify(wishlist)), [wishlist]);

  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addToCart = useCallback(
    (product, { size, color, quantity = 1 } = {}) => {
      setCart((prev) => {
        const key = `${product.id}-${size || ""}-${color || ""}`;
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
        }
        return [
          ...prev,
          {
            key,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
            size: size || (product.sizes?.[0] || "Medium"),
            color: color || (product.colors?.[0] || "#111827"),
            quantity,
          },
        ];
      });
      showToast(`${product.name} added to cart`);
    },
    [showToast]
  );

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key, quantity) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  }, []);

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.find((p) => p.id === product.id);
        if (exists) {
          showToast("Removed from wishlist");
          return prev.filter((p) => p.id !== product.id);
        }
        showToast("Added to wishlist");
        return [...prev, { id: product.id, name: product.name, image: product.images?.[0] || product.image, price: product.price }];
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback((id) => wishlist.some((p) => p.id === id), [wishlist]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQty,
        toggleWishlist,
        isWishlisted,
        showToast,
        toasts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
