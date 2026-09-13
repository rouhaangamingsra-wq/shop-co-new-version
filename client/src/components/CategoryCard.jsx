import { Link } from "react-router-dom";

export default function CategoryCard({ category, className = "" }) {
  return (
    <Link
      to={`/category/${category.name.toLowerCase()}`}
      className={`group relative block overflow-hidden rounded-2xl bg-gray-100 ${className}`}
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="text-lg font-semibold text-white drop-shadow">{category.name}</span>
      </div>
    </Link>
  );
}
