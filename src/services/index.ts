/**
 * Single place that decides which backend the storefront uses.
 * Today everything runs on the localStorage demo backend. When the dedicated
 * Prime Clothing Supabase project is ready, add Supabase implementations of
 * AuthService / OrderService / NewsletterService (see ./types) and return them
 * here when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
 */
import { localAuthService, localNewsletterService, localOrderService } from './mock';
import type { AuthService, NewsletterService, OrderService } from './types';

export const isDemoBackend = true;

export const authService: AuthService = localAuthService;
export const orderService: OrderService = localOrderService;
export const newsletterService: NewsletterService = localNewsletterService;

export type * from './types';
