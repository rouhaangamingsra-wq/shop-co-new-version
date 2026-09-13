import { Star } from "lucide-react";

export default function Rating({ value = 0, count, size = 16, className = "" }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full;
          const isHalf = i === full && half;
          return (
            <span key={i} className="relative">
              <Star size={size} className="text-gray-300" fill="currentColor" strokeWidth={0} />
              {(filled || isHalf) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? "50%" : "100%" }}
                >
                  <Star size={size} className="text-amber-400" fill="currentColor" strokeWidth={0} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-sm text-gray-600 ml-1">
          {value.toFixed(1)} <span className="text-gray-400">({count})</span>
        </span>
      )}
    </div>
  );
}
