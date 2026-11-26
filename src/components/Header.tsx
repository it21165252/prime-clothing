import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon, ArrowRight } from './Icons';
import { searchProducts } from '../data/products';
import { formatLKR } from '../lib/format';

const NAV_LINKS = [
  { to: '/collections/new-in', label: 'New In' },
  { to: '/collections/men', label: 'Men' },
  { to: '/collections/women', label: 'Women' },
  { to: '/collections/riding-gear', label: 'Riding Gear' },
  { to: '/collections/accessories', label: 'Accessories' },
];

export function Header() {
  const { itemCount, openDrawer } = useCart();
  const { customer } = useAuth();
  const location = useLocation();
  // Overlays remember which route they were opened on, so navigating closes them.
  const routeKey = location.pathname + location.search;
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const [searchOpenOn, setSearchOpenOn] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = menuOpenOn === routeKey;
  const searchOpen = searchOpenOn === routeKey;
  const setMenuOpen = (v: boolean) => setMenuOpenOn(v ? routeKey : null);
  const setSearchOpen = (v: boolean) => setSearchOpenOn(v ? routeKey : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? 'shadow-[0_1px_0_#e5e5e5]' : 'border-b border-neutral-200'}`}>
        <div className="mx-auto max-w-[1600px] h-16 md:h-[72px] px-4 md:px-8 grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="flex items-center gap-1 lg:hidden">
            <button className="p-2 -ml-2" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <MenuIcon size={22} />
            </button>
            <button className="p-2" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={20} />
            </button>
          </div>

          <Link to="/" className="justify-self-center lg:justify-self-start" aria-label="Prime Clothing home">
            <Logo className="h-7 md:h-8" />
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-8" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `label relative py-2 transition-colors hover:text-prime ${isActive ? 'text-prime' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1 md:gap-2">
            <button className="hidden lg:flex p-2" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={20} />
            </button>
            <Link to={customer ? '/account' : '/account/login'} className="p-2" aria-label="Account">
              <UserIcon size={20} />
            </Link>
            <button className="relative p-2 -mr-2" aria-label={`Bag, ${itemCount} items`} onClick={openDrawer}>
              <BagIcon size={21} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-prime text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} signedIn={!!customer} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose, signedIn }: { open: boolean; onClose: () => void; signedIn: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm bg-white flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            aria-label="Menu"
          >
            <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-200">
              <Logo className="h-6" />
              <button className="p-2 -mr-2" aria-label="Close menu" onClick={onClose}>
                <CloseIcon size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="flex items-center justify-between py-4 border-b border-neutral-100 font-display text-3xl font-bold">
                  {l.label}
                  <ArrowRight size={18} />
                </Link>
              ))}
              <Link to="/collections/all" className="flex items-center justify-between py-4 border-b border-neutral-100 font-display text-3xl font-bold">
                Shop All
                <ArrowRight size={18} />
              </Link>
              <div className="mt-6 space-y-3">
                <Link to={signedIn ? '/account' : '/account/login'} className="label block">{signedIn ? 'My Account' : 'Sign In / Join'}</Link>
                <Link to="/pages/delivery" className="label block text-neutral-500">Delivery</Link>
                <Link to="/pages/returns" className="label block text-neutral-500">Returns & Exchanges</Link>
                <Link to="/pages/contact" className="label block text-neutral-500">Contact</Link>
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-x-0 top-0 z-50 bg-white"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-label="Search"
          >
            <SearchPanel onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = searchProducts(q).slice(0, 6);

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <form onSubmit={submit} className="mx-auto max-w-[1600px] px-4 md:px-8 h-20 flex items-center gap-4 border-b border-neutral-200">
        <SearchIcon size={22} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tees, hoodies, jackets..."
          className="flex-1 h-full text-lg md:text-2xl font-display font-bold outline-none placeholder:text-neutral-300"
          aria-label="Search products"
        />
        <button type="button" className="p-2 -mr-2" aria-label="Close search" onClick={onClose}>
          <CloseIcon size={22} />
        </button>
      </form>
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-6 max-h-[70vh] overflow-y-auto">
        {q.trim() === '' ? (
          <div>
            <p className="label text-neutral-500 mb-4">Popular</p>
            <div className="flex flex-wrap gap-2">
              {['Hoodie', 'Leather', 'Tee', 'Gloves', 'Cap', 'Jersey'].map((t) => (
                <button key={t} onClick={() => setQ(t)} className="label border border-neutral-300 px-4 py-2 hover:border-ink">
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="text-neutral-500">No results for "{q}".</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {results.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group">
                  <div className="aspect-[4/5] bg-mist overflow-hidden">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <p className="mt-2 text-sm font-semibold">{p.name}</p>
                  <p className="text-sm text-neutral-500">{formatLKR(p.price)}</p>
                </Link>
              ))}
            </div>
            <button onClick={submit} className="label mt-6 inline-flex items-center gap-2 underline underline-offset-4">
              View all results <ArrowRight size={14} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
