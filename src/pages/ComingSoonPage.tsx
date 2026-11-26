import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { ArrowRight, CheckIcon, FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from '../components/Icons';
import { newsletterService } from '../services';
import { LIFESTYLE } from '../data/products';

// Placeholder social links (same as the store footer).
const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://facebook.com', label: 'Facebook', Icon: FacebookIcon },
  { href: 'https://tiktok.com', label: 'TikTok', Icon: TikTokIcon },
  { href: 'https://youtube.com', label: 'YouTube', Icon: YouTubeIcon },
];

const TITLE = 'Prime Clothing | Coming Soon';
const DESCRIPTION =
  'Prime Clothing is coming soon. Rider-inspired streetwear and riding gear from the Prime Racing family, made for the roads of Sri Lanka.';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function ComingSoonPage() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = TITLE;
    setMeta('description', DESCRIPTION);
    setMeta('og:title', TITLE, 'property');
    setMeta('og:description', DESCRIPTION, 'property');
    document.body.style.background = '#0a0a0a';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setState('busy');
    // Demo: stored in this browser only until the Prime Clothing backend exists.
    await newsletterService.subscribe(email.trim().toLowerCase());
    setState('done');
  };

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="relative min-h-svh overflow-hidden bg-ink text-white flex flex-col">
      {/* Full-bleed background */}
      <motion.img
        src={LIFESTYLE.hero}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-[72%_30%] opacity-45"
        initial={reduce ? false : { scale: 1.12 }}
        animate={reduce ? undefined : { scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />

      {/* Top bar */}
      <header className="relative z-10 mx-auto w-full max-w-[1600px] px-5 md:px-10 pt-6 md:pt-8 flex items-center justify-between">
        <motion.div {...fadeUp(0)}>
          <Logo variant="light" className="h-7 md:h-9" />
        </motion.div>
        <motion.p {...fadeUp(0.1)} className="label !text-[0.62rem] text-white/60 hidden sm:block">
          primeclothing.lk
        </motion.p>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-[1600px] px-5 md:px-10 flex flex-col justify-center py-16">
        <motion.p {...fadeUp(0.15)} className="label text-prime mb-5 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-prime" />
          Drop 01 / Loading
        </motion.p>
        <motion.h1
          {...fadeUp(0.25)}
          className="font-display font-extrabold text-[4.2rem] leading-[0.86] sm:text-8xl md:text-[9rem] lg:text-[11rem]"
        >
          Coming <br />
          <span className="text-prime">soon</span>
        </motion.h1>
        <motion.p {...fadeUp(0.4)} className="mt-6 max-w-lg text-sm md:text-base text-white/70 leading-relaxed">
          Rider-inspired tees, hoodies, jackets and riding gear, made for life on two wheels. Built for the ride, landing in Sri Lanka soon.
        </motion.p>

        <motion.div {...fadeUp(0.55)} className="mt-10 max-w-md">
          {state === 'done' ? (
            <div className="flex items-start gap-3 border border-white/20 p-4" role="status">
              <span className="w-8 h-8 shrink-0 rounded-full bg-prime flex items-center justify-center">
                <CheckIcon size={16} />
              </span>
              <div>
                <p className="label">You're on the list</p>
                <p className="text-sm text-white/60 mt-1">We'll email you the moment the first drop goes live.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="label !text-[0.65rem] text-white/80 mb-3">Get notified at launch</p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="Your email address"
                  aria-label="Email address"
                  autoComplete="email"
                  className={`flex-1 min-w-0 h-12 px-4 text-sm bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40 outline-none border ${error ? 'border-prime' : 'border-white/30 focus:border-white'}`}
                />
                <button type="submit" disabled={state === 'busy'} className="btn btn-red !h-12 !px-5 shrink-0">
                  {state === 'busy' ? '...' : (
                    <>
                      <span className="hidden sm:inline">Notify me</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
              {error && <p className="text-xs text-prime mt-2" role="alert">{error}</p>}
            </form>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        {...fadeUp(0.7)}
        className="relative z-10 mx-auto w-full max-w-[1600px] px-5 md:px-10 pb-6 md:pb-8 flex flex-col-reverse sm:flex-row gap-5 sm:items-center justify-between"
      >
        <p className="text-xs text-white/50">
          From the Prime Racing family.{' '}
          <a href="https://primeracing.lk" target="_blank" rel="noreferrer" className="text-white hover:text-prime underline underline-offset-4 transition-colors">
            primeracing.lk
          </a>
        </p>
        <div className="flex gap-2">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-prime hover:text-prime transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </motion.footer>
    </div>
  );
}
