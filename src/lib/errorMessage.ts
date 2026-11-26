/**
 * Turns any thrown value (Error, Supabase-style error object, string) into a readable message.
 */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (typeof err !== 'object') return fallback;
  const e = err as { message?: unknown; details?: unknown; hint?: unknown };
  const parts = [e.message, e.details, e.hint].filter((v): v is string => typeof v === 'string' && v.trim() !== '');
  return parts.length ? [...new Set(parts)].join(' ') : fallback;
}
