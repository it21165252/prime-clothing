/**
 * Backend contracts. The storefront only talks to these interfaces, so the
 * localStorage mock in ./mock can be swapped for a dedicated Prime Clothing
 * Supabase project later without touching the UI.
 */

export type Customer = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  createdAt: string;
};

export type AuthResult = { customer: Customer | null; error: string | null };

export interface AuthService {
  getCurrentCustomer(): Promise<Customer | null>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(input: { email: string; password: string; fullName: string }): Promise<AuthResult>;
  signOut(): Promise<void>;
  updateProfile(id: string, patch: Partial<Pick<Customer, 'fullName' | 'phone'>>): Promise<AuthResult>;
  onChange(listener: (customer: Customer | null) => void): () => void;
}

export type OrderLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  colour: string;
  size: string;
  unitPrice: number;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode?: string;
};

export type PaymentMethod = 'cod' | 'bank_transfer' | 'card';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string | null;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
};

export type NewOrder = Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>;

export interface OrderService {
  createOrder(input: NewOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  listOrdersForCustomer(customerId: string): Promise<Order[]>;
}

export interface NewsletterService {
  subscribe(email: string): Promise<void>;
}
