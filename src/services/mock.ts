/**
 * DEMO BACKEND: localStorage implementation of the service contracts.
 * Nothing leaves the browser. Passwords are hashed with SHA-256 only to avoid
 * storing them in plain text in localStorage; this is NOT real security and
 * must be replaced by Supabase Auth (or similar) before going live.
 */
import type { AuthService, Customer, NewsletterService, NewOrder, Order, OrderService } from './types';

const USERS_KEY = 'pc-demo-users-v1';
const SESSION_KEY = 'pc-demo-session-v1';
const ORDERS_KEY = 'pc-demo-orders-v1';
const NEWSLETTER_KEY = 'pc-demo-newsletter-v1';

type StoredUser = Customer & { passwordHash: string };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix: string) {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${prefix}_${rand.replace(/-/g, '').slice(0, 16)}`;
}

async function hash(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(text);
}

const strip = ({ passwordHash: _ph, ...c }: StoredUser): Customer => {
  void _ph;
  return c;
};

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

class LocalAuthService implements AuthService {
  private listeners = new Set<(c: Customer | null) => void>();

  private emit(c: Customer | null) {
    this.listeners.forEach((l) => l(c));
  }

  async getCurrentCustomer() {
    const id = read<string | null>(SESSION_KEY, null);
    if (!id) return null;
    const user = read<StoredUser[]>(USERS_KEY, []).find((u) => u.id === id);
    return user ? strip(user) : null;
  }

  async signIn(email: string, password: string) {
    await delay();
    const users = read<StoredUser[]>(USERS_KEY, []);
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.passwordHash !== (await hash(password))) {
      return { customer: null, error: 'Incorrect email or password.' };
    }
    write(SESSION_KEY, user.id);
    const c = strip(user);
    this.emit(c);
    return { customer: c, error: null };
  }

  async signUp({ email, password, fullName }: { email: string; password: string; fullName: string }) {
    await delay();
    const users = read<StoredUser[]>(USERS_KEY, []);
    const normalised = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalised)) {
      return { customer: null, error: 'An account with this email already exists. Try signing in.' };
    }
    if (password.length < 6) return { customer: null, error: 'Password must be at least 6 characters.' };
    const user: StoredUser = {
      id: uid('cus'),
      email: normalised,
      fullName: fullName.trim(),
      createdAt: new Date().toISOString(),
      passwordHash: await hash(password),
    };
    write(USERS_KEY, [...users, user]);
    write(SESSION_KEY, user.id);
    const c = strip(user);
    this.emit(c);
    return { customer: c, error: null };
  }

  async signOut() {
    localStorage.removeItem(SESSION_KEY);
    this.emit(null);
  }

  async updateProfile(id: string, patch: Partial<Pick<Customer, 'fullName' | 'phone'>>) {
    await delay(150);
    const users = read<StoredUser[]>(USERS_KEY, []);
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return { customer: null, error: 'Account not found.' };
    users[idx] = { ...users[idx], ...patch };
    write(USERS_KEY, users);
    const c = strip(users[idx]);
    this.emit(c);
    return { customer: c, error: null };
  }

  onChange(listener: (c: Customer | null) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

class LocalOrderService implements OrderService {
  async createOrder(input: NewOrder): Promise<Order> {
    await delay(500);
    const orders = read<Order[]>(ORDERS_KEY, []);
    const order: Order = {
      ...input,
      id: uid('ord'),
      orderNumber: `PC${String(Date.now()).slice(-6)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    write(ORDERS_KEY, [order, ...orders]);
    return order;
  }

  async getOrder(id: string) {
    return read<Order[]>(ORDERS_KEY, []).find((o) => o.id === id) ?? null;
  }

  async listOrdersForCustomer(customerId: string) {
    return read<Order[]>(ORDERS_KEY, []).filter((o) => o.customerId === customerId);
  }
}

class LocalNewsletterService implements NewsletterService {
  async subscribe(email: string) {
    await delay(300);
    const list = read<string[]>(NEWSLETTER_KEY, []);
    if (!list.includes(email)) write(NEWSLETTER_KEY, [...list, email]);
  }
}

export const localAuthService = new LocalAuthService();
export const localOrderService = new LocalOrderService();
export const localNewsletterService = new LocalNewsletterService();
