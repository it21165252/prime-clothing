import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { orderService, type Order } from '../services';
import { formatLKR } from '../lib/format';
import { ArrowRight, BagIcon } from '../components/Icons';

const PAYMENT_LABEL: Record<Order['paymentMethod'], string> = {
  cod: 'Cash on delivery',
  bank_transfer: 'Bank transfer',
  card: 'Card',
};

const PAYMENT_NOTE: Record<Order['paymentMethod'], string> = {
  cod: 'Pay in cash when your order arrives. Please keep the exact amount ready if you can.',
  bank_transfer: 'Transfer the total using your order number as the reference. We ship as soon as the payment clears.',
  card: 'Your card has been charged.',
};

// TODO(client): replace with Prime Clothing's real account details before launch.
const BANK_DETAILS = [
  { label: 'Bank', value: 'Bank name (to be confirmed)' },
  { label: 'Account name', value: 'Prime Clothing (Pvt) Ltd' },
  { label: 'Account no.', value: '0000 0000 0000' },
  { label: 'Branch', value: 'Branch (to be confirmed)' },
];

const STEPS = [
  { title: 'Order received', text: 'We have your order and are getting it ready.' },
  { title: 'Packed', text: 'Checked, folded and packed at the Prime Clothing studio.' },
  { title: 'On its way', text: 'Handed to our courier. Island-wide delivery in 2 to 4 working days.' },
];

/** How many timeline steps are complete for an order status. */
const STEPS_DONE: Record<Order['status'], number> = { pending: 1, confirmed: 1, shipped: 3, delivered: 3, cancelled: 0 };

const EASE = [0.22, 1, 0.36, 1] as const;

export default function OrderConfirmationPage() {
  const { id = '' } = useParams();
  const [result, setResult] = useState<{ id: string; order: Order | null } | null>(null);

  useEffect(() => {
    let alive = true;
    orderService
      .getOrder(id)
      .catch(() => null)
      .then((order) => {
        if (alive) setResult({ id, order });
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (!result || result.id !== id) return <LoadingState />;
  if (!result.order) return <MissingOrder id={id} />;
  return <Confirmation order={result.order} />;
}

function Confirmation({ order }: { order: Order }) {
  const reduce = useReducedMotion();
  const firstName = order.shipping.fullName.trim().split(/\s+/)[0];
  const itemCount = order.lines.reduce((n, l) => n + l.quantity, 0);
  const placedOn = new Date(order.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' });
  const stepsDone = STEPS_DONE[order.status] ?? 1;

  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-mist/60">
        <motion.div
          className="mx-auto max-w-2xl px-4 pt-14 pb-12 md:pt-20 md:pb-16 text-center flex flex-col items-center"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: reduce ? 0 : 0.5 } } }}
        >
          <AnimatedCheck reduce={!!reduce} />
          <motion.p variants={item} className="label text-prime mt-6">Order confirmed</motion.p>
          <motion.h1 variants={item} className="font-display font-extrabold text-5xl md:text-6xl leading-[0.95] mt-3">
            {firstName ? `Thanks, ${firstName}` : 'Thanks for your order'}
          </motion.h1>
          <motion.div variants={item} className="mt-5">
            <OrderChip number={order.orderNumber} />
          </motion.div>
          <motion.p variants={item} className="text-neutral-600 text-sm md:text-base mt-5 max-w-md leading-relaxed">
            Your order is in. A confirmation is on its way to <span className="text-ink font-medium break-words">{order.shipping.email}</span>, and we'll text{' '}
            <span className="text-ink font-medium whitespace-nowrap">{order.shipping.phone}</span> when it ships.
          </motion.p>
        </motion.div>
      </section>

      {/* Details */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-10 md:py-14 grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
        {/* Items + totals */}
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.9, ease: EASE }}
          aria-labelledby="order-items"
        >
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 id="order-items" className="font-display font-extrabold text-2xl md:text-3xl">Your order</h2>
            <p className="label text-neutral-500">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} / {placedOn}
            </p>
          </div>
          <ul>
            {order.lines.map((l) => (
              <li key={`${l.productId}-${l.colour}-${l.size}`} className="flex gap-4 md:gap-5 py-5 border-b border-neutral-200">
                <Link to={`/products/${l.slug}`} className="shrink-0 w-20 md:w-24 aspect-[4/5] bg-mist overflow-hidden">
                  <img src={l.image} alt={l.name} loading="lazy" className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between gap-4">
                    <Link to={`/products/${l.slug}`} className="text-sm md:text-base font-semibold hover:text-prime transition-colors">
                      {l.name}
                    </Link>
                    <p className="text-sm md:text-base font-semibold whitespace-nowrap">{formatLKR(l.unitPrice * l.quantity)}</p>
                  </div>
                  <dl className="mt-1.5 text-xs md:text-sm text-neutral-500 flex flex-wrap gap-x-4 gap-y-1">
                    <div className="flex gap-1"><dt>Colour:</dt><dd className="text-neutral-700">{l.colour}</dd></div>
                    <div className="flex gap-1"><dt>Size:</dt><dd className="text-neutral-700">{l.size}</dd></div>
                    <div className="flex gap-1"><dt>Qty:</dt><dd className="text-neutral-700">{l.quantity}</dd></div>
                  </dl>
                  {l.quantity > 1 && <p className="mt-auto pt-2 text-xs text-neutral-400">{formatLKR(l.unitPrice)} each</p>}
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 text-sm sm:max-w-sm sm:ml-auto">
            <div className="flex justify-between"><dt className="text-neutral-500">Subtotal</dt><dd>{formatLKR(order.subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Delivery</dt>
              <dd>{order.deliveryFee === 0 ? <span className="text-prime font-medium">Free</span> : formatLKR(order.deliveryFee)}</dd>
            </div>
            <div className="flex justify-between items-baseline border-t border-neutral-200 pt-3 mt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display font-extrabold text-2xl">{formatLKR(order.total)}</dd>
            </div>
          </dl>
        </motion.section>

        {/* Side cards */}
        <motion.aside
          className="space-y-4"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 1.05, ease: EASE }}
        >
          <Card title="Delivery">
            <p className="text-sm leading-relaxed text-neutral-700">
              <span className="font-semibold text-ink">{order.shipping.fullName}</span>
              <br />
              {order.shipping.addressLine1}
              <br />
              {order.shipping.addressLine2 && (
                <>
                  {order.shipping.addressLine2}
                  <br />
                </>
              )}
              {order.shipping.city}, {order.shipping.district}
              {order.shipping.postalCode && ` ${order.shipping.postalCode}`}
            </p>
            <p className="text-xs text-neutral-500 mt-3">Estimated delivery: 2 to 4 working days</p>
          </Card>

          <Card title="Contact">
            <p className="text-sm text-neutral-700 break-words">{order.shipping.email}</p>
            <p className="text-sm text-neutral-700 mt-1">{order.shipping.phone}</p>
          </Card>

          <Card title="Payment" aside={<span className="label !text-[0.62rem] bg-ink text-white px-2 py-1">{PAYMENT_LABEL[order.paymentMethod]}</span>}>
            <p className="text-sm text-neutral-600 leading-relaxed">{PAYMENT_NOTE[order.paymentMethod]}</p>
            {order.paymentMethod === 'bank_transfer' && (
              <dl className="mt-4 border-t border-neutral-200 pt-4 space-y-2 text-sm">
                {BANK_DETAILS.map((d) => (
                  <div key={d.label} className="flex justify-between gap-4">
                    <dt className="text-neutral-500">{d.label}</dt>
                    <dd className="text-right font-medium">{d.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Reference</dt>
                  <dd className="text-right font-semibold text-prime">{order.orderNumber}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Amount</dt>
                  <dd className="text-right font-semibold">{formatLKR(order.total)}</dd>
                </div>
              </dl>
            )}
          </Card>

          <Card title="What happens next">
            <ol className="mt-1">
              {STEPS.map((s, i) => {
                const done = i < stepsDone;
                const last = i === STEPS.length - 1;
                return (
                  <li key={s.title} className="relative flex gap-4 pb-5 last:pb-0">
                    {!last && <span className={`absolute left-[11px] top-7 bottom-1 w-px ${i < stepsDone - 1 ? 'bg-prime' : 'bg-neutral-200'}`} aria-hidden />}
                    <span
                      className={`relative z-10 mt-0.5 h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[0.65rem] font-bold ${
                        done ? 'bg-prime text-white' : 'border border-neutral-300 text-neutral-400 bg-white'
                      }`}
                      aria-hidden
                    >
                      {done ? <SmallCheck /> : i + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${done ? 'text-ink' : 'text-neutral-500'}`}>
                        {s.title}
                        <span className="sr-only">{done ? ' (done)' : ' (upcoming)'}</span>
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{s.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          <div className="flex flex-col gap-3 pt-2">
            <Link to="/collections/new-in" className="btn btn-primary w-full">
              Continue shopping <ArrowRight size={14} />
            </Link>
            {order.customerId ? (
              <Link to="/account" className="btn btn-outline w-full">View my orders</Link>
            ) : (
              <Link to="/pages/contact" className="btn btn-outline w-full">Questions about your order?</Link>
            )}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function Card({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="border border-neutral-200 p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="label">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** Order number chip; click to copy. */
function OrderChip({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the number is still visible to copy by hand */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-300 bg-white pl-4 pr-3 h-9 text-sm hover:border-ink transition-colors"
      aria-label={`Order number ${number}. Copy to clipboard`}
    >
      <span className="label !text-[0.62rem] text-neutral-500">Order</span>
      <span className="font-semibold tracking-wide tabular-nums">#{number}</span>
      <span className="label !text-[0.6rem] text-neutral-400 group-hover:text-prime transition-colors min-w-[2.6rem] text-left" aria-live="polite">
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}

/** Red ring + tick that draw themselves in. Static when reduced motion is on. */
function AnimatedCheck({ reduce }: { reduce: boolean }) {
  const draw = (delay: number, duration: number) =>
    reduce ? { initial: false as const } : { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay, duration, ease: EASE } };
  return (
    <motion.div
      className="relative h-16 w-16 md:h-[72px] md:w-[72px]"
      initial={reduce ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      aria-hidden
    >
      <svg viewBox="0 0 72 72" className="h-full w-full" fill="none">
        <circle cx="36" cy="36" r="34" className="fill-white" />
        <motion.circle cx="36" cy="36" r="33" stroke="#e10600" strokeWidth="2.5" style={{ rotate: -90, transformOrigin: '50% 50%' }} {...draw(0.1, 0.7)} />
        <motion.path d="M23 37.5l8.5 8.5L49.5 28" stroke="#e10600" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter" {...draw(0.65, 0.45)} />
      </svg>
    </motion.div>
  );
}

function SmallCheck() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden>
      <path d="M2.5 6.2l2.3 2.3L9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 md:py-32 flex flex-col items-center gap-4" role="status" aria-label="Loading order">
      <div className="h-16 w-16 rounded-full bg-mist animate-pulse" />
      <div className="h-3 w-28 bg-mist animate-pulse" />
      <div className="h-10 w-64 bg-mist animate-pulse" />
    </div>
  );
}

function MissingOrder({ id }: { id: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 md:py-32 text-center flex flex-col items-center">
      <div className="h-16 w-16 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400">
        <BagIcon size={26} />
      </div>
      <p className="label text-neutral-500 mt-6">Order not found</p>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-[0.95] mt-3">We can't find that order</h1>
      <p className="text-neutral-600 text-sm md:text-base mt-4 max-w-md leading-relaxed">
        Order details are saved on the device you checked out with. If you placed an order, check your confirmation email or get in touch and
        we'll look it up for you.
      </p>
      {id && <p className="mt-3 text-xs text-neutral-400 break-words">Reference: {id}</p>}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link to="/collections/new-in" className="btn btn-primary">Continue shopping</Link>
        <Link to="/pages/contact" className="btn btn-outline">Contact us</Link>
      </div>
    </div>
  );
}
