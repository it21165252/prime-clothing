import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService, type Customer } from '../services';

type AuthContextValue = {
  customer: Customer | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<Customer, 'fullName' | 'phone'>>) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authService.getCurrentCustomer().then((c) => {
      if (!active) return;
      setCustomer(c);
      setLoading(false);
    });
    const off = authService.onChange(setCustomer);
    return () => {
      active = false;
      off();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password);
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await authService.signUp({ email, password, fullName });
    return { error };
  }, []);

  const signOut = useCallback(() => authService.signOut(), []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<Customer, 'fullName' | 'phone'>>) => {
      if (!customer) return { error: 'Not signed in.' };
      const { error } = await authService.updateProfile(customer.id, patch);
      return { error };
    },
    [customer]
  );

  return (
    <AuthContext.Provider value={{ customer, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
