import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService, type Order } from '../services';
import { formatLKR } from '../lib/format';
import { CheckIcon } from '../components/Icons';

const PAYMENT_LABEL: Record<Order['paymentMethod'], string> = {
  cod: 'Cash on delivery',
  bank_transfer: 'Bank transfer',
  card: 'Card',
};

export default function OrderConfirmationPage() {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    orderService.getOrder(id).then(setOrder);
  }, [id]);

  if (order === undefined) return <div className="py-40 text-center label text-neutral-400">Loading order...</div>;
  if (order === null)
    return (
      <div className="mx-auto max-w-xl px-4 py-28 text-center">
        <h1 className="font-display text-5xl font-extrabold">Order not found</h1>
        <p className="text-neutral-500 mt-3 text-sm">We couldn't find that order on this device.</p>
        <Link to="/" className="btn btn-primary mt-6">Back to Home</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-12 md:py-20">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="w-14 h-14 rounded-full bg-prime text-white flex items-center justify-center">
        <CheckIcon size={28} />
      </motion.div>
      <p className="label text-neutral-500 mt-6">Order #{order.orderNumber}</p>
      <h1 className="font-display text-5xl md:text-7xl font-extrabold mt-2">Thanks, {order.shipping.fullName.split(' ')[0]}</h1>
      <p className="text-neutral-600 mt-4">
        Your order is in. We'll send a confirmation to <strong>{order.shipping.email}</strong> and text {order.shipping.phone} when it ships.
      </p>
      {order.paymentMethod === 'bank_transfer' && (
        <div className="mt-6 border border-neutral-200 p-5 text-sm">
          <p className="label mb-2">Bank transfer</p>
          <p className="text-neutral-600">
            Our team will email the bank details. Please use <strong>{order.orderNumber}</strong> as the payment reference. Your order ships once the payment clears.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <div>
          <p className="label mb-3">Delivering to</p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {order.shipping.fullName}<br />
            {order.shipping.addressLine1}<br />
            {order.shipping.addressLine2 && <>{order.shipping.addressLine2}<br /></>}
            {order.shipping.city}, {order.shipping.district}
            {order.shipping.postalCode && ` ${order.shipping.postalCode}`}
          </p>
        </div>
        <div>
          <p className="label mb-3">Payment</p>
          <p className="text-sm text-neutral-600">{PAYMENT_LABEL[order.paymentMethod]}</p>
          <p className="label mt-5 mb-3">Estimated delivery</p>
          <p className="text-sm text-neutral-600">2 to 4 working days</p>
        </div>
      </div>

      <div className="mt-10 border-t border-neutral-200">
        {order.lines.map((l) => (
          <div key={`${l.productId}-${l.colour}-${l.size}`} className="flex gap-4 py-4 border-b border-neutral-200">
            <img src={l.image} alt="" className="w-16 aspect-[4/5] object-cover bg-mist" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{l.name}</p>
              <p className="text-xs text-neutral-500">{l.colour} / {l.size} / Qty {l.quantity}</p>
            </div>
            <p className="text-sm font-semibold">{formatLKR(l.unitPrice * l.quantity)}</p>
          </div>
        ))}
        <dl className="pt-4 space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatLKR(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{order.deliveryFee === 0 ? 'Free' : formatLKR(order.deliveryFee)}</dd></div>
          <div className="flex justify-between font-bold text-base"><dt>Total</dt><dd>{formatLKR(order.total)}</dd></div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-3 mt-12">
        <Link to="/collections/new-in" className="btn btn-primary">Continue shopping</Link>
        {order.customerId && <Link to="/account" className="btn btn-outline">View my orders</Link>}
      </div>
    </div>
  );
}
