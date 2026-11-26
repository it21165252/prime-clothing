import { Fragment, useRef } from 'react';
import { useIntro } from '../contexts/IntroContext';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { LIFESTYLE, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { Newsletter } from '../components/Footer';
import { ArrowRight, ChevronLeft, ChevronRight, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';
import { FREE_DELIVERY_THRESHOLD, formatLKR } from '../lib/format';


const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const HEADLINE = [
  { text: 'Built' },
  { text: 'for', breakAfter: true },
  { text: 'the' },
  { text: 'ride', accent: true },
];
const wordUp: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};
const fadeRight: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Red accent word: an underline stripe wipes in, then a single metallic shine sweeps across. */
function AccentWord({ text, active, reduce }: { text: string; active: boolean; reduce: boolean }) {
  return (
    <span className="relative inline-block text-prime">
      {/* The shine is painted inside the word's own glyphs (background-clip: text), so there is no duplicate text. */}
      <span className={reduce ? undefined : `hero-shine ${active ? 'is-active' : ''}`}>{text}</span>
      <motion.span
        className="absolute left-0 right-0 bottom-[0.06em] h-[0.06em] bg-prime origin-left"
        initial={false}
        animate={{ scaleX: active || reduce ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 1.0, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden
      />
    </span>
  );
}

const CATEGORY_TILES = [
  { to: '/collections/tees', label: 'Tees', image: LIFESTYLE.tees },
  { to: '/collections/hoodies', label: 'Hoodies', image: LIFESTYLE.hoodies },
  { to: '/collections/jackets', label: 'Jackets', image: LIFESTYLE.jackets },
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
  const { ready } = useIntro();
  const show = ready || reduce ? 'show' : 'hidden';
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const newArrivals = [...PRODUCTS].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[calc(100svh-100px)] min-h-[520px] max-h-[900px] overflow-hidden bg-ink">
        {/* Parallax wrapper (scroll) around a slow Ken Burns zoom (on intro) */}
        <motion.div className="absolute inset-0 will-change-transform" style={reduce ? undefined : { y: heroY }}>
          <picture>
            <source media="(max-width: 767px)" srcSet={LIFESTYLE.heroMobile} type="image/webp" />
            <source media="(max-width: 767px)" srcSet={LIFESTYLE.heroMobileJpg} type="image/jpeg" />
            <source srcSet={LIFESTYLE.hero} type="image/webp" />
            <motion.img
              src={LIFESTYLE.heroJpg}
              alt={LIFESTYLE.heroAlt}
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover object-[center_10%] md:object-[72%_0%]"
              initial={reduce ? false : { scale: 1.14 }}
              animate={reduce ? undefined : { scale: ready ? 1 : 1.14 }}
              transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </picture>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        <motion.div
          className="relative h-full mx-auto max-w-[1600px] px-4 md:px-8 flex flex-col justify-end pb-14 md:pb-20"
          initial={false}
          animate={show}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
        >
          {/* Eyebrow: red rule draws in, then the label slides in */}
          <motion.div className="flex items-center gap-3 mb-4" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}>
            <motion.span
              className="block h-px w-8 bg-prime origin-left"
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease: EASE_OUT } } }}
            />
            <motion.p className="label text-white/80" variants={fadeRight}>New Season / Drop 01</motion.p>
          </motion.div>

          {/* Headline: each word slides up out of its own mask */}
          <motion.h1
            className="font-display text-white text-[3.6rem] leading-[0.92] sm:text-7xl md:text-8xl lg:text-[9rem] font-extrabold max-w-4xl"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          >
            {HEADLINE.map((w) => (
              <Fragment key={w.text}>
                <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
                  <motion.span className="inline-block" variants={wordUp}>
                    {w.accent ? <AccentWord text={w.text} active={ready} reduce={!!reduce} /> : w.text}
                  </motion.span>
                </span>
                {w.breakAfter ? <br className="hidden sm:block" /> : null}{' '}
              </Fragment>
            ))}
          </motion.h1>

          <motion.p className="text-white/75 mt-5 max-w-md text-sm md:text-base" variants={fadeUp}>
            Rider-inspired streetwear and riding gear from the Prime Racing family. Made for the road, styled for everything after.
          </motion.p>

          <motion.div className="flex flex-wrap gap-3 mt-8" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp}>
              <Link to="/collections/new-in" className="group btn btn-wipe bg-white text-ink [--wipe:#e10600] hover:text-white">
                <span>Shop Now</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link to="/collections/riding-gear" className="btn btn-wipe border border-white text-white [--wipe:#ffffff] hover:text-ink">
                Riding Gear
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hidden md:flex absolute bottom-6 right-8 items-center gap-3 text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 1.4 }}
          aria-hidden
        >
          <span className="label !text-[0.6rem]">Scroll</span>
          <span className="relative block h-10 w-px bg-white/25 overflow-hidden">
            <span className="scroll-cue-dot absolute left-0 top-0 h-3 w-px bg-prime" />
          </span>
        </motion.div>
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 pt-14 md:pt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {CATEGORY_TILES.map((t, i) => (
            <Reveal key={t.to} delay={i * 0.06} className={i === 0 ? 'col-span-2 md:col-span-1' : undefined}>
              <Link to={t.to} className={`group relative block overflow-hidden bg-mist ${i === 0 ? 'aspect-[16/10] md:aspect-[3/4]' : 'aspect-[3/4]'}`}>
                <picture>
                  <source srcSet={t.image.webp} type="image/webp" />
                  <img
                    src={t.image.jpg}
                    alt={t.image.alt}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover ${t.image.position} transition-transform duration-700 group-hover:scale-105`}
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex items-end justify-between gap-3 text-white">
                  <span className="min-w-0 font-display text-2xl md:text-3xl xl:text-4xl leading-[0.95] font-extrabold">{t.label}</span>
                  <ArrowRight size={20} className="mb-1 shrink-0 transition-transform group-hover:translate-x-1" />
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
          <picture>
            <source srcSet={LIFESTYLE.ride} type="image/webp" />
            <img src={LIFESTYLE.rideJpg} alt={LIFESTYLE.rideAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-[42%_100%]" />
          </picture>
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
            <h2 className="font-display text-5xl md:text-8xl font-extrabold">Dressed for the ride</h2>
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
