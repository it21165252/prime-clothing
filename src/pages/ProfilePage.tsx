import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { orderService, type Customer, type Order } from '../services';
import { formatLKR } from '../lib/format';

const STATUS_STYLE: Record<Order['status'], string> = {
  pending: 'bg-neutral-100 text-neutral-700',
  confirmed: 'bg-ink text-white',
  shipped: 'bg-prime text-white',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-neutral-100 text-neutral-400 line-through',
};

export default function ProfilePage() {
  const { customer, loading, signOut, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tab, setTab] = useState<'orders' | 'details'>('orders');

  useEffect(() => {
    if (!customer) return;
    orderService.listOrdersForCustomer(customer.id).then(setOrders);
  }, [customer]);

  if (loading) return <div className="py-40 text-center label text-neutral-400">Loading...</div>;
  if (!customer) return <Navigate to="/account/login" replace />;

  return (
    <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-neutral-500">My account</p>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-1">Hey, {customer.fullName.split(' ')[0]}</h1>
        </div>
        <button onClick={() => signOut().then(() => toast.success('Signed out'))} className="label underline underline-offset-4">Sign out</button>
      </div>

      <div className="flex gap-8 border-b border-neutral-200 mt-10">
        {(['orders', 'details'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`label pb-4 -mb-px border-b-2 ${tab === t ? 'border-ink' : 'border-transparent text-neutral-400'}`}>
            {t === 'orders' ? 'Orders' : 'Details'}
          </button>
        ))}
      </div>

      {tab === 'orders' ? (
        <div className="mt-8">
          {orders === null ? (
            <p className="label text-neutral-400">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center border border-neutral-200">
              <p className="font-display text-3xl font-bold">No orders yet</p>
              <p className="text-sm text-neutral-500 mt-2">Your orders will show up here.</p>
              <Link to="/collections/new-in" className="btn btn-primary mt-6">Shop New In</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <Link key={o.id} to={`/order-confirmation/${o.id}`} className="block border border-neutral-200 p-5 hover:border-ink transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">Order #{o.orderNumber}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {new Date(o.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })} / {o.lines.reduce((n, l) => n + l.quantity, 0)} items
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`label !text-[0.6rem] px-2.5 py-1 ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                      <span className="text-sm font-semibold">{formatLKR(o.total)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {o.lines.slice(0, 5).map((l) => (
                      <img key={`${l.productId}-${l.size}-${l.colour}`} src={l.image} alt={l.name} className="w-14 aspect-[4/5] object-cover bg-mist" />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <DetailsForm key={customer.id} customer={customer} onSave={updateProfile} />
      )}
    </div>
  );
}

function DetailsForm({ customer, onSave }: { customer: Customer; onSave: (patch: { fullName: string; phone: string }) => Promise<{ error: string | null }> }) {
  const [fullName, setFullName] = useState(customer.fullName);
  const [phone, setPhone] = useState(customer.phone ?? '');
  const [saving, setSaving] = useState(false);

  const save = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await onSave({ fullName: fullName.trim(), phone: phone.trim() });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success('Details saved');
  };

  return (
    <form onSubmit={save} className="mt-8 max-w-md space-y-4">
      <label className="block">
        <span className="label !text-[0.65rem] block mb-1.5">Full name</span>
        <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </label>
      <label className="block">
        <span className="label !text-[0.65rem] block mb-1.5">Email</span>
        <input className="input bg-mist text-neutral-500" value={customer.email} disabled />
      </label>
      <label className="block">
        <span className="label !text-[0.65rem] block mb-1.5">Mobile number</span>
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXX XXXX" />
      </label>
      <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save details'}</button>
    </form>
  );
}
