import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Intro loader ported from Prime Racing: on finish, red and black racing stripes sweep
 * across the screen while the logo flies into the header logo position.
 */
const STRIPES = ['#e10600', '#0a0a0a', '#b80500', '#141414', '#e10600', '#0a0a0a', '#c80500', '#141414'];
const STRIPE_STAGGER = 0.05;
const SWEEP_DURATION = 2;
/** Moment every stripe covers the screen, so the dark backdrop can be removed unseen. */
const COVERED_AT = 1.05;
const FLIGHT_DELAY = 0.8;
const FLIGHT_DURATION = 1.2;
const FINISH_AT = 2.45;
const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

type Flight = { x: number; y: number; scale: number };

interface IntroLoaderProps {
  progress: number;
  /** The header logo the loader logo should land on. */
  targetRef: RefObject<HTMLImageElement | null>;
  onReady: () => void;
}

export function IntroLoader({ progress, targetRef, onReady }: IntroLoaderProps) {
  const done = progress >= 100;
  const reduceMotion = useReducedMotion();
  const logoRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const [flight, setFlight] = useState<Flight | null>(null);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!done) return;
    if (reduceMotion) {
      const t = window.setTimeout(() => onReadyRef.current(), 400);
      return () => window.clearTimeout(t);
    }
    const measure = window.setTimeout(() => {
      const from = logoRef.current?.getBoundingClientRect();
      const to = targetRef.current?.getBoundingClientRect();
      if (from && to && from.width > 0 && to.width > 0) {
        setFlight({
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: to.width / from.width,
        });
      } else {
        setFlight({ x: 0, y: 0, scale: 1 });
      }
    }, FLIGHT_DELAY * 1000);
    const finish = window.setTimeout(() => onReadyRef.current(), FINISH_AT * 1000);
    return () => {
      window.clearTimeout(measure);
      window.clearTimeout(finish);
    };
  }, [done, reduceMotion, targetRef]);

  const sweeping = done && !reduceMotion;

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: done && reduceMotion ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: done ? 'none' : 'auto' }}
      role="status"
      aria-label="Loading Prime Clothing"
    >
      {/* Dark backdrop, dropped while the stripes cover the screen */}
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={{ opacity: 1 }}
        animate={{ opacity: sweeping ? 0 : 1 }}
        transition={{ duration: 0.05, delay: sweeping ? COVERED_AT : 0 }}
      />

      {/* Diagonal red and black stripes */}
      {sweeping && (
        <div className="absolute left-[-25%] top-[-25%] w-[150%] h-[150%] flex flex-col" style={{ transform: 'rotate(-12deg)' }} aria-hidden>
          {STRIPES.map((color, i) => (
            <motion.div
              key={i}
              className="flex-1 w-full"
              style={{ backgroundColor: color }}
              initial={{ x: '-101%' }}
              animate={{ x: ['-101%', '0%', '0%', '101%'] }}
              transition={{ duration: SWEEP_DURATION, times: [0, 0.3, 0.6, 1], delay: i * STRIPE_STAGGER, ease: EASE_IN_OUT }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        <motion.div
          ref={logoRef}
          className="relative mb-10"
          style={{ transformOrigin: 'center center' }}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={flight ?? { x: 0, y: 0, scale: 1 }}
          transition={{ duration: FLIGHT_DURATION, ease: EASE_IN_OUT }}
        >
          {/* White-letter logo on the dark loader... */}
          <motion.img
            src="/logo.png"
            alt="Prime Clothing"
            width={960}
            height={212}
            className="block h-14 md:h-20 w-auto max-w-[80vw] object-contain"
            animate={{ opacity: flight ? 0 : 1 }}
            transition={{ duration: 0.35, delay: flight ? FLIGHT_DURATION * 0.6 : 0 }}
            draggable={false}
          />
          {/* ...cross-fades to the dark-letter logo as it lands on the white header. */}
          <motion.img
            src="/logo-dark.png"
            alt=""
            aria-hidden
            width={960}
            height={212}
            className="absolute inset-0 h-full w-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: flight ? 1 : 0 }}
            transition={{ duration: 0.35, delay: flight ? FLIGHT_DURATION * 0.6 : 0 }}
            draggable={false}
          />
        </motion.div>
        <motion.div className="flex flex-col items-center" animate={{ opacity: done ? 0 : 1 }} transition={{ duration: 0.2 }}>
          <div className="w-48 h-px bg-white/20 overflow-hidden mb-4">
            <motion.div
              className="h-full bg-prime"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'tween', duration: 0.2 }}
            />
          </div>
          <span className="label !text-[0.62rem] text-white/50 tabular-nums">{Math.round(progress)}%</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
