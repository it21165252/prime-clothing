import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { IntroLoader } from '../components/IntroLoader';

/**
 * Intro loader state. The loader plays once per browser session (like Prime Racing):
 * its logo flies into the header logo, then `ready` flips to true so the header logo
 * appears and page intros (e.g. the home hero) can start.
 */
const SESSION_KEY = 'pc-intro-played';
const MIN_LOADER_MS = 1400;
const MAX_LOADER_MS = 4500;

type IntroContextValue = {
  /** True once the loader has handed off (or immediately if it already played this session). */
  ready: boolean;
  /** The header logo the loader logo lands on. */
  headerLogoRef: RefObject<HTMLImageElement | null>;
};

const IntroContext = createContext<IntroContextValue | null>(null);

function alreadyPlayed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(alreadyPlayed);
  const [progress, setProgress] = useState(0);
  const headerLogoRef = useRef<HTMLImageElement>(null);

  // Fake-but-honest progress: creeps toward 90% while the page, fonts and hero image load,
  // then jumps to 100% once everything is in (bounded by MIN/MAX so it never drags).
  useEffect(() => {
    if (ready) return;
    window.scrollTo(0, 0);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const start = performance.now();
    let loaded = document.readyState === 'complete';
    let finished = false;
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);
    let fontsReady = false;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    const tick = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const allIn = loaded && (fontsReady || !document.fonts);
      if (!finished && ((allIn && elapsed >= MIN_LOADER_MS) || elapsed >= MAX_LOADER_MS)) {
        finished = true;
        setProgress(100);
        window.clearInterval(tick);
        return;
      }
      setProgress((p) => Math.min(90, p + Math.max(1, (90 - p) * 0.08)));
    }, 60);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener('load', onLoad);
      html.style.overflow = prevOverflow;
    };
  }, [ready]);

  const handleReady = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode: just replay next time */
    }
    setReady(true);
  }, []);

  return (
    <IntroContext.Provider value={{ ready, headerLogoRef }}>
      {children}
      {!ready && <IntroLoader progress={progress} targetRef={headerLogoRef} onReady={handleReady} />}
    </IntroContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error('useIntro must be used within an IntroProvider');
  return ctx;
}
