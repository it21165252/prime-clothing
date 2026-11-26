import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { formatLKR } from '../lib/format';
import { CloseIcon } from './Icons';
import { CartLineItem } from './CartLineItem';
import { FreeDeliveryProgress } from './FreeDeliveryProgress';

export function CartDrawer() {
  const { items, itemCount, subtotal, isDrawerOpen, closeDrawer } = useCart();
  const location = useLocation();

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} />
          <motion.aside
            role="dialog"
            aria-label="Your bag"
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-200">
              <p className="font-display text-2xl font-bold">Your Bag ({itemCount})</p>
              <button className="p-2 -mr-2" onClick={closeDrawer} aria-label="Close bag">
                <CloseIcon size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <p className="font-display text-3xl font-bold">Your bag is empty</p>
                <p className="text-sm text-neutral-500 mt-2">Gear up. New drops are waiting.</p>
                <Link to="/collections/new-in" className="btn btn-primary mt-6">Shop New In</Link>
              </div>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-neutral-200">
                  <FreeDeliveryProgress subtotal={subtotal} />
                </div>
                <div className="flex-1 overflow-y-auto px-5">
                  {items.map((i) => (
                    <CartLineItem key={i.key} item={i} onNavigate={closeDrawer} />
                  ))}
                </div>
                <div className="border-t border-neutral-200 p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="label">Subtotal</span>
                    <span className="font-semibold">{formatLKR(subtotal)}</span>
                  </div>
                  <p className="text-xs text-neutral-500">Delivery calculated at checkout.</p>
                  <Link to="/checkout" className="btn btn-red w-full">Checkout</Link>
                  <Link to="/cart" className="btn btn-outline w-full">View Bag</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
