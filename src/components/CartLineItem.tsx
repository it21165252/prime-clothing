import { Link } from 'react-router-dom';
import type { CartItem } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { formatLKR } from '../lib/format';
import { MinusIcon, PlusIcon } from './Icons';

export function CartLineItem({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const { updateQuantity, removeItem } = useCart();
  return (
    <div className="flex gap-4 py-5 border-b border-neutral-200">
      <Link to={`/products/${item.slug}`} onClick={onNavigate} className="w-24 shrink-0 aspect-[4/5] bg-mist overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between gap-3">
          <Link to={`/products/${item.slug}`} onClick={onNavigate} className="text-sm font-semibold leading-snug hover:underline">
            {item.name}
          </Link>
          <p className="text-sm font-semibold whitespace-nowrap">{formatLKR(item.price * item.quantity)}</p>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          {item.colour} / {item.size}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-center border border-neutral-300 h-9">
            <button className="w-9 h-full flex items-center justify-center hover:bg-mist" aria-label="Decrease quantity" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
              <MinusIcon size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
            <button
              className="w-9 h-full flex items-center justify-center hover:bg-mist disabled:opacity-30"
              aria-label="Increase quantity"
              disabled={item.quantity >= item.maxQuantity}
              onClick={() => updateQuantity(item.key, item.quantity + 1)}
            >
              <PlusIcon size={14} />
            </button>
          </div>
          <button className="text-xs underline underline-offset-4 text-neutral-500 hover:text-ink" onClick={() => removeItem(item.key)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
