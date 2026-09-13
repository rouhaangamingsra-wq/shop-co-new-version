export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-navy-border bg-navy-card p-5 ${className}`}>
      {children}
    </div>
  );
}
