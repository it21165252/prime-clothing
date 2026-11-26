import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from './Logo';
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon, ArrowRight } from './Icons';
import { newsletterService } from '../services';
import { FREE_DELIVERY_THRESHOLD, formatLKR } from '../lib/format';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { to: '/collections/new-in', label: 'New In' },
      { to: '/collections/men', label: 'Men' },
      { to: '/collections/women', label: 'Women' },
      { to: '/collections/riding-gear', label: 'Riding Gear' },
      { to: '/collections/accessories', label: 'Accessories' },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/pages/delivery', label: 'Delivery Information' },
      { to: '/pages/returns', label: 'Returns & Exchanges' },
      { to: '/pages/size-guide', label: 'Size Guide' },
      { to: '/pages/contact', label: 'Contact Us' },
      { to: '/account', label: 'Track My Order' },
    ],
  },
  {
    title: 'About',
    links: [
      { to: '/pages/about', label: 'Our Story' },
      { to: '/pages/terms', label: 'Terms & Conditions' },
      { to: '/pages/privacy', label: 'Privacy Policy' },
    ],
  },
];

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://facebook.com', label: 'Facebook', Icon: FacebookIcon },
  { href: 'https://tiktok.com', label: 'TikTok', Icon: TikTokIcon },
  { href: 'https://youtube.com', label: 'YouTube', Icon: YouTubeIcon },
];

export function Newsletter({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const dark = tone === 'dark';

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setBusy(true);
    await newsletterService.subscribe(email.trim().toLowerCase());
    setBusy(false);
    setEmail('');
    toast.success("You're in. Watch your inbox for new drops.");
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className={`flex-1 h-12 px-4 text-sm outline-none border ${dark ? 'bg-transparent border-white/30 text-white placeholder:text-white/40 focus:border-white' : 'bg-white border-neutral-300 focus:border-ink'}`}
      />
      <button type="submit" disabled={busy} className="btn btn-red !h-12 !px-5" aria-label="Subscribe">
        {busy ? '...' : <ArrowRight size={18} />}
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-white/70">
          {[
            ['Island-wide delivery', `Free over ${formatLKR(FREE_DELIVERY_THRESHOLD)}`],
            ['Cash on delivery', 'Pay when it arrives'],
            ['14-day exchanges', 'Size not right? Swap it'],
            ['Secure payments', 'Visa, Mastercard, bank transfer'],
          ].map(([t, s]) => (
            <div key={t}>
              <p className="label text-white">{t}</p>
              <p className="text-xs mt-1">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-14 grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo variant="light" className="h-9" />
          <p className="mt-5 text-sm text-white/60 max-w-sm">
            Rider-inspired streetwear and riding gear, designed in Sri Lanka for life on two wheels.
          </p>
          <p className="label mt-8 mb-3">Join the crew</p>
          <p className="text-sm text-white/60 mb-4">Early access to drops, restocks and rider events.</p>
          <Newsletter tone="dark" />
          <div className="flex gap-2 mt-8">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-prime hover:text-prime transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="label mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="label mb-4">Prime Racing</p>
            <p className="text-sm text-white/60 mb-4">Looking for your next machine? Visit our parent company.</p>
            <a href="https://primeracing.lk" target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 text-white hover:text-prime transition-colors">
              primeracing.lk <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-5 flex flex-col md:flex-row gap-3 md:items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Prime Clothing (Pvt) Ltd. A Prime Racing company. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {['VISA', 'Mastercard', 'AMEX', 'COD', 'Bank Transfer'].map((m) => (
              <span key={m} className="border border-white/20 px-2 py-1 text-[10px] font-semibold tracking-wider">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
