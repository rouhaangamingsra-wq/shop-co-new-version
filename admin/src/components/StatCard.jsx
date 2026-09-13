import Card from "./Card";

export default function StatCard({ icon: Icon, label, value, change, color = "#6C4DFF" }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brand-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`mt-1 text-xs ${change.startsWith("-") ? "text-red-400" : "text-green-400"}`}>
              {change} vs last month
            </p>
          )}
        </div>
        <div
          className="grid h-11 w-11 place-items-center rounded-xl"
          style={{ background: `${color}22`, color }}
        >
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
