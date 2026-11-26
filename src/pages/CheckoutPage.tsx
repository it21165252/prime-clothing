import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService, type PaymentMethod, type ShippingAddress } from '../services';
import { deliveryFeeFor, formatLKR } from '../lib/format';
import { getErrorMessage } from '../lib/errorMessage';

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
  'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam',
  'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
];

const PAYMENT_OPTIONS: { key: PaymentMethod; title: string; text: string }[] = [
  { key: 'cod', title: 'Cash on delivery', text: 'Pay in cash when your order arrives.' },
  { key: 'bank_transfer', title: 'Bank transfer', text: 'We will email our bank details. Your order ships once payment clears.' },
  { key: 'card', title: 'Card payment', text: 'Visa / Mastercard via secure payment gateway (coming soon, demo only).' },
];

export default function CheckoutPage() {
  const { loading } = useAuth();
  if (loading) return <div className="py-40 text-center label text-neutral-400">Loading...</div>;
  return <CheckoutForm />;
}

function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const delivery = deliveryFeeFor(subtotal);
  const total = subtotal + delivery;

  const [form, setForm] = useState<ShippingAddress>({
    fullName: customer?.fullName ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: 'Colombo',
    postalCode: '',
  });
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er: typeof errors = {};
    if (!form.fullName.trim()) er.fullName = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Enter a valid email';
    if (!/^(?:\+94|0)?7\d{8}$/.test(form.phone.replace(/[\s-]/g, ''))) er.phone = 'Enter a valid Sri Lankan mobile number (07X XXX XXXX)';
    if (!form.addressLine1.trim()) er.addressLine1 = 'Enter your address';
    if (!form.city.trim()) er.city = 'Enter your city';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const placeOrder = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please check the highlighted fields.');
      return;
    }
    if (payment === 'card') {
      toast.error('Card payments are not live yet. Please choose cash on delivery or bank transfer.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        customerId: customer?.id ?? null,
        lines: items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          name: i.name,
          image: i.image,
          colour: i.colour,
          size: i.size,
          unitPrice: i.price,
          quantity: i.quantity,
        })),
        subtotal,
        deliveryFee: delivery,
        total,
        shipping: form,
        paymentMethod: payment,
        notes: notes.trim() || undefined,
      });
      clearCart();
      navigate(`/order-confirmation/${order.id}`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not place your order. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-28 text-center">
        <h1 className="font-display text-5xl font-extrabold">Your bag is empty</h1>
        <Link to="/collections/all" className="btn btn-primary mt-6">Shop All</Link>
      </div>
    );
  }

  const Field = ({ k, label, type = 'text', autoComplete, optional }: { k: keyof ShippingAddress; label: string; type?: string; autoComplete?: string; optional?: boolean }) => (
    <label className="block">
      <span className="label !text-[0.65rem] block mb-1.5">{label}{optional && <span className="text-neutral-400 normal-case tracking-normal font-normal"> (optional)</span>}</span>
      <input className={`input ${errors[k] ? '!border-prime' : ''}`} type={type} value={form[k] ?? ''} onChange={set(k)} autoComplete={autoComplete} />
      {errors[k] && <span className="text-xs text-prime mt-1 block">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="mx-auto max-w-[1300px] px-4 md:px-8 py-10 md:py-14">
      <h1 className="font-display text-5xl md:text-6xl font-extrabold">Checkout</h1>
      {!customer && (
        <p className="text-sm text-neutral-500 mt-3">
          Have an account? <Link to="/account/login?redirect=/checkout" className="underline text-ink">Sign in</Link> for faster checkout and order tracking.
        </p>
      )}

      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 mt-8" noValidate>
        <div className="space-y-10">
          <section>
            <h2 className="label mb-5">1. Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {Field({ k: 'email', label: 'Email', type: 'email', autoComplete: 'email' })}
              {Field({ k: 'phone', label: 'Mobile number', type: 'tel', autoComplete: 'tel' })}
            </div>
          </section>

          <section>
            <h2 className="label mb-5">2. Delivery address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">{Field({ k: 'fullName', label: 'Full name', autoComplete: 'name' })}</div>
              <div className="sm:col-span-2">{Field({ k: 'addressLine1', label: 'Address', autoComplete: 'address-line1' })}</div>
              <div className="sm:col-span-2">{Field({ k: 'addressLine2', label: 'Apartment, suite, etc.', autoComplete: 'address-line2', optional: true })}</div>
              {Field({ k: 'city', label: 'City', autoComplete: 'address-level2' })}
              <label className="block">
                <span className="label !text-[0.65rem] block mb-1.5">District</span>
                <select className="input" value={form.district} onChange={set('district')}>
                  {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              {Field({ k: 'postalCode', label: 'Postal code', autoComplete: 'postal-code', optional: true })}
            </div>
          </section>

          <section>
            <h2 className="label mb-5">3. Payment</h2>
            <div className="border border-neutral-200 divide-y divide-neutral-200">
              {PAYMENT_OPTIONS.map((o) => (
                <label key={o.key} className={`flex gap-4 p-4 cursor-pointer ${payment === o.key ? 'bg-mist' : ''}`}>
                  <input type="radio" name="payment" className="mt-1 accent-[#e10600]" checked={payment === o.key} onChange={() => setPayment(o.key)} />
                  <span>
                    <span className="block text-sm font-semibold">{o.title}</span>
                    <span className="block text-xs text-neutral-500 mt-0.5">{o.text}</span>
                  </span>
                </label>
              ))}
            </div>
            <label className="block mt-6">
              <span className="label !text-[0.65rem] block mb-1.5">Order notes <span className="text-neutral-400 normal-case tracking-normal font-normal">(optional)</span></span>
              <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery instructions, landmarks, etc." />
            </label>
          </section>
        </div>

        <aside>
          <div className="bg-mist p-6 lg:sticky lg:top-[96px]">
            <p className="font-display text-3xl font-bold mb-4">Your Order</p>
            <ul className="divide-y divide-neutral-200">
              {items.map((i) => (
                <li key={i.key} className="flex gap-3 py-3">
                  <div className="relative w-16 aspect-[4/5] bg-white shrink-0">
                    <img src={i.image} alt="" className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink text-white text-[10px] font-bold flex items-center justify-center">{i.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug">{i.name}</p>
                    <p className="text-xs text-neutral-500">{i.colour} / {i.size}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatLKR(i.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 pt-4 border-t border-neutral-300 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatLKR(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{delivery === 0 ? 'Free' : formatLKR(delivery)}</dd></div>
              <div className="flex justify-between text-base font-bold pt-2"><dt>Total</dt><dd>{formatLKR(total)}</dd></div>
            </dl>
            <button type="submit" disabled={submitting} className="btn btn-red w-full mt-6 !h-14">
              {submitting ? 'Placing order...' : `Place order / ${formatLKR(total)}`}
            </button>
            <p className="text-[11px] text-neutral-500 mt-3 text-center">
              By placing your order you agree to our <Link to="/pages/terms" className="underline">terms</Link>.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
