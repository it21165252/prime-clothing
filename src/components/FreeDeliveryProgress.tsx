import { FREE_DELIVERY_THRESHOLD, formatLKR } from '../lib/format';

export function FreeDeliveryProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  return (
    <div>
      <p className="text-xs mb-2">
        {remaining > 0 ? (
          <>
            You're <strong>{formatLKR(remaining)}</strong> away from free island-wide delivery
          </>
        ) : (
          <strong>You've unlocked free island-wide delivery</strong>
        )}
      </p>
      <div className="h-1 bg-neutral-200">
        <div className="h-full bg-prime transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
