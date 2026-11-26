/**
 * Coming Soon gating.
 *
 * The live domain (primeclothing.lk / www.primeclothing.lk) shows only the
 * Coming Soon page. Everything else (localhost, 127.0.0.1, LAN IPs,
 * *.vercel.app previews) shows the full store.
 *
 * Overrides, in priority order:
 *  1. Preview: `/coming-soon` path or `?coming-soon=1` query always shows the page,
 *     so it can be reviewed on localhost or Vercel.
 *  2. Env: VITE_COMING_SOON=true forces it on everywhere, VITE_COMING_SOON=false forces it off
 *     everywhere (use this on launch day, or just remove the domain from the list below).
 *  3. Hostname: on for the domains in COMING_SOON_HOSTS.
 */

export const COMING_SOON_HOSTS = ['primeclothing.lk', 'www.primeclothing.lk'];
export const COMING_SOON_PREVIEW_PATH = '/coming-soon';
export const COMING_SOON_PREVIEW_PARAM = 'coming-soon';

type Loc = Pick<Location, 'hostname' | 'pathname' | 'search'>;

export function isComingSoonPreview(loc: Loc = window.location): boolean {
  const path = loc.pathname.replace(/\/+$/, '');
  if (path === COMING_SOON_PREVIEW_PATH) return true;
  const v = new URLSearchParams(loc.search).get(COMING_SOON_PREVIEW_PARAM);
  return v !== null && v !== '0' && v !== 'false';
}

function envOverride(): boolean | null {
  const raw = String(import.meta.env.VITE_COMING_SOON ?? '').trim().toLowerCase();
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  return null;
}

export function shouldShowComingSoon(loc: Loc = window.location): boolean {
  if (isComingSoonPreview(loc)) return true;
  const forced = envOverride();
  if (forced !== null) return forced;
  return COMING_SOON_HOSTS.includes(loc.hostname.toLowerCase());
}
