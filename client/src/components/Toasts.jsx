import { CheckCircle2 } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Toasts() {
  const { toasts } = useShop();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toastIn flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm text-white shadow-lg"
        >
          <CheckCircle2 size={16} className="text-green-400" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
