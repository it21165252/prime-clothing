export function formatLKR(amount: number): string {
  return `LKR ${Math.round(amount).toLocaleString('en-LK')}`;
}

export const FREE_DELIVERY_THRESHOLD = Number(import.meta.env.VITE_FREE_DELIVERY_THRESHOLD) || 15000;
export const STANDARD_DELIVERY_FEE = 450;

export function deliveryFeeFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
}
