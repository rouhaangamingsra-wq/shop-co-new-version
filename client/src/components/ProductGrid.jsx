import ProductCard from "./ProductCard";

export default function ProductGrid({ products, columns = 4 }) {
  const cols = {
    2: "grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];
  return (
    <div className={`grid ${cols} grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
