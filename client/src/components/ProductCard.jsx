import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Rating from "./Rating";
import { useShop } from "../context/ShopContext";

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);

  return (
    <div className="group relative flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5]">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">
              -{product.discount}%
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110"
      >
        <Heart
          size={18}
          className={wished ? "text-red-500" : "text-gray-700"}
          fill={wished ? "currentColor" : "none"}
        />
      </button>

      <div className="mt-3 flex flex-col gap-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:underline">
            {product.name}
          </h3>
        </Link>
        <Rating value={product.rating} count={product.reviews} />
        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">${product.price}</span>
          {product.oldPrice > 0 && (
            <span className="text-sm text-gray-400 line-through">${product.oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
