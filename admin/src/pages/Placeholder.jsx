import { Construction } from "lucide-react";
import Card from "../components/Card";

export default function Placeholder({ title }) {
  return (
    <Card className="flex flex-col items-center justify-center py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-purple/20 text-brand-purple">
        <Construction size={28} />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-brand-muted">
        This module is part of the admin template and is reserved for future expansion. Use the
        Application section to manage orders, users, products, and categories.
      </p>
    </Card>
  );
}
