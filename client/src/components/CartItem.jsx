import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem({ item, onRemove, onQty }) {
  return (
    <div className="flex gap-4 border-b border-gray-100 py-5">
      <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
            <p className="mt-1 text-xs text-gray-500">Size: {item.size}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-500">Color:</span>
              <span
                className="inline-block h-4 w-4 rounded-full border border-gray-200"
                style={{ background: item.color }}
              />
            </div>
          </div>
          <button onClick={() => onRemove(item.key)} aria-label="Remove item" className="h-fit text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-gray-200">
            <button onClick={() => onQty(item.key, item.quantity - 1)} className="grid h-8 w-8 place-items-center text-gray-600 hover:text-black" aria-label="Decrease">
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button onClick={() => onQty(item.key, item.quantity + 1)} className="grid h-8 w-8 place-items-center text-gray-600 hover:text-black" aria-label="Increase">
              <Plus size={14} />
            </button>
          </div>
          <span className="text-sm font-semibold">${item.price * item.quantity}</span>
        </div>
      </div>
    </div>
  );
}
