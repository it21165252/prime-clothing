import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { LIFESTYLE, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { Newsletter } from '../components/Footer';
import { ArrowRight, ChevronLeft, ChevronRight, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';
import { FREE_DELIVERY_THRESHOLD, formatLKR } from '../lib/format';

const CATEGORY_TILES = [
  { to: '/collections/men', label: 'Men', image: LIFESTYLE.men },
  { to: '/collections/women', label: 'Women', image: LIFESTYLE.women },
  { to: '/collections/riding-gear', label: 'Riding Gear', image: LIFESTYLE.ridingGear },
  { to: '/collections/accessories', label: 'Accessories', image: LIFESTYLE.accessories },
];

function SectionHeader({ eyebrow, title, to }: { eyebrow: string; title: string; to?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
      <div>
        <p className="label text-prime mb-2">{eyebrow}</p>
        <h2 className="font-display text-4xl md:text-6xl font-extrabold">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="label shrink-0 inline-flex items-center gap-2 underline underline-offset-4 hover:text-prime">
          View all <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function ProductRail({ products }: { products: typeof PRODUCTS }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
        {products.map((p, i) => (
          <div key={p.id} className="snap-start shrink-0 w-[68%] sm:w-[42%] md:w-[30%] lg:w-[23%]">
            <ProductCard product={p} priority={i < 2} />
          </div>
        ))}
      </div>
      <div className="hidden md:flex gap-2 justify-end mt-6">
        <button onClick={() => scroll(-1)} aria-label="Previous" className="w-11 h-11 border border-neutral-300 flex items-center justify-center hover:border-ink">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => scroll(1)} aria-label="Next" className="w-11 h-11 border border-neutral-300 flex items-center justify-center hover:border-ink">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const reduce = useReducedMotion();
  const newArrivals = [...PRODUCTS].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[calc(100svh-100px)] min-h-[520px] max-h-[900px] overflow-hidden bg-ink">
        <motion.img
          src={LIFESTYLE.hero}
          srcSet={`${LIFESTYLE.heroMobile} 1000w, ${LIFESTYLE.hero} 2000w`}
          sizes="100vw"
          alt="Rider with a black motorcycle"
          className="absolute inset-0 w-full h-full object-cover"
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="relative h-full mx-auto max-w-[1600px] px-4 md:px-8 flex flex-col justify-end pb-14 md:pb-20">
          <motion.div initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="label text-white/80 mb-4">New Season / Drop 01</p>
            <h1 className="font-display text-white text-[3.6rem] leading-[0.88] sm:text-7xl md:text-8xl lg:text-[9rem] font-extrabold max-w-4xl">
              Built for <br className="hidden sm:block" />
              the <span className="text-prime">ride</span>
            </h1>
            <p className="text-white/75 mt-5 max-w-md text-sm md:text-base">
              Rider-inspired streetwear and riding gear from the Prime Racing family. Made for the road, styled for everything after.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/collections/new-in" className="btn btn-white">Shop Now</Link>
              <Link to="/collections/riding-gear" className="btn border border-white text-white hover:bg-white hover:text-ink">Riding Gear</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 pt-14 md:pt-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {CATEGORY_TILES.map((t, i) => (
            <Reveal key={t.to} delay={i * 0.06}>
              <Link to={t.to} className="group relative block aspect-[3/4] overflow-hidden bg-mist">
                <img src={t.image} alt={t.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex items-end justify-between text-white">
                  <span className="font-display text-3xl md:text-5xl font-extrabold">{t.label}</span>
                  <ArrowRight size={20} className="mb-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 pt-16 md:pt-24">
        <Reveal>
          <SectionHeader eyebrow="Just landed" title="New Arrivals" to="/collections/new-in" />
        </Reveal>
        <ProductRail products={newArrivals} />
      </section>

      {/* Split lifestyle banner */}
      <section className="mt-16 md:mt-24 grid lg:grid-cols-2 bg-ink text-white">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[640px] overflow-hidden">
          <img src={LIFESTYLE.ride} alt="Rider at sunset" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex items-center px-6 py-14 md:px-16 lg:px-20">
          <Reveal>
            <p className="label text-prime mb-4">The Prime Standard</p>
            <h2 className="font-display text-5xl md:text-7xl font-extrabold">Built for <br />the ride</h2>
            <p className="text-white/65 mt-6 max-w-md leading-relaxed">
              Every piece starts on the bike. Heavyweight fabrics that hold up to wind and sun, cuts that work in the saddle,
              and protection where it counts. Designed by riders at Prime Racing, made for the roads of Sri Lanka.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                [ShieldIcon, 'CE-rated armour in our riding jackets and jeans'],
                [TruckIcon, `Free island-wide delivery over ${formatLKR(FREE_DELIVERY_THRESHOLD)}`],
                [ReturnIcon, 'Free size exchanges within 14 days'],
              ].map(([Icon, text], i) => {
                const I = Icon as typeof ShieldIcon;
                return (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <I size={20} className="text-prime shrink-0" />
                    {text as string}
                  </li>
                );
              })}
            </ul>
            <Link to="/collections/riding-gear" className="btn btn-red mt-10">Shop Riding Gear</Link>
          </Reveal>
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 pt-16 md:pt-24">
        <Reveal>
          <SectionHeader eyebrow="Rider favourites" title="Best Sellers" to="/collections/best-sellers" />
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-5">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Community banner */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 pt-16 md:pt-24">
        <Link to="/collections/all" className="group relative block h-[420px] md:h-[520px] overflow-hidden bg-ink">
          <img src={LIFESTYLE.community} alt="Classic motorcycle on an open road" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
            <p className="label mb-4">Prime Racing x Prime Clothing</p>
            <h2 className="font-display text-5xl md:text-8xl font-extrabold">Ride the extraordinary</h2>
            <span className="btn btn-white mt-8">Shop All</span>
          </div>
        </Link>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24">
        <div className="border border-neutral-200 px-6 py-12 md:px-16 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="label text-prime mb-3">Join the crew</p>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold">Get first access</h2>
            <p className="text-neutral-500 mt-3 max-w-md text-sm">
              Sign up for early access to limited drops, restocks and Prime Racing rider events. No spam, just the good stuff.
            </p>
          </div>
          <div className="md:justify-self-end w-full max-w-md">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
