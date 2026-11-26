import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** One cart line = one product in one colour and one size. */
export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  colour: string;
  size: string;
  quantity: number;
  maxQuantity: number;
};

type AddInput = Omit<CartItem, 'key' | 'quantity'>;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: AddInput, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = 'prime-clothing-cart-v1';
const CartContext = createContext<CartContextValue | null>(null);

const lineKey = (productId: string, colour: string, size: string) => `${productId}::${colour}::${size}`;

function clamp(q: number, max: number) {
  return Math.min(Math.max(1, Math.floor(q)), Math.max(1, max));
}

function loadCart(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && i.productId && i.size && i.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(loadCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((item: AddInput, quantity = 1) => {
    const key = lineKey(item.productId, item.colour, item.size);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, ...item, quantity: clamp(i.quantity + quantity, item.maxQuantity) } : i));
      }
      return [...prev, { ...item, key, quantity: clamp(quantity, item.maxQuantity) }];
    });
  }, []);

  const removeItem = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity < 1 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, quantity: clamp(quantity, i.maxQuantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, isDrawerOpen, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
