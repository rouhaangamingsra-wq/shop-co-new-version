import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.to && !last ? (
              <Link to={item.to} className="transition hover:text-black">
                {item.label}
              </Link>
            ) : (
              <span className={last ? "font-medium text-gray-900" : ""}>{item.label}</span>
            )}
            {!last && <ChevronRight size={14} className="text-gray-400" />}
          </span>
        );
      })}
    </nav>
  );
}
