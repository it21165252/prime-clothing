import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CartLineItem } from '../components/CartLineItem';
import { FreeDeliveryProgress } from '../components/FreeDeliveryProgress';
import { deliveryFeeFor, formatLKR } from '../lib/format';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export default function CartPage() {
  const { items, itemCount, subtotal } = useCart();
  const delivery = deliveryFeeFor(subtotal);
  const suggestions = PRODUCTS.filter((p) => p.group === 'accessories' && !items.some((i) => i.productId === p.id)).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-10 md:py-14">
      <h1 className="font-display text-5xl md:text-7xl font-extrabold">Your Bag</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-3xl font-bold">Your bag is empty</p>
          <p className="text-neutral-500 mt-2 text-sm">Nothing here yet. Let's fix that.</p>
          <Link to="/collections/new-in" className="btn btn-primary mt-6">Shop New In</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 mt-8">
          <div>
            <p className="label text-neutral-500 pb-4 border-b border-neutral-200">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            {items.map((i) => (
              <CartLineItem key={i.key} item={i} />
            ))}
          </div>
          <aside>
            <div className="bg-mist p-6 lg:sticky lg:top-[96px]">
              <p className="font-display text-3xl font-bold mb-5">Order Summary</p>
              <FreeDeliveryProgress subtotal={subtotal} />
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{formatLKR(subtotal)}</dd></div>
                <div className="flex justify-between"><dt>Delivery</dt><dd className="font-semibold">{delivery === 0 ? 'Free' : formatLKR(delivery)}</dd></div>
                <div className="flex justify-between border-t border-neutral-300 pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold">{formatLKR(subtotal + delivery)}</dd></div>
              </dl>
              <Link to="/checkout" className="btn btn-red w-full mt-6">Checkout</Link>
              <Link to="/collections/all" className="label block text-center mt-4 underline underline-offset-4">Continue shopping</Link>
            </div>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="pt-20">
          <h2 className="font-display text-4xl font-extrabold mb-8">Complete the kit</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-5">
            {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
