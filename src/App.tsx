import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { IntroProvider } from './contexts/IntroContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ScrollToTop } from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import InfoPage from './pages/InfoPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <IntroProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/collections" element={<CollectionPage />} />
                {/* Old gender collections were removed; send any stale links to Shop All. */}
                <Route path="/collections/men" element={<Navigate to="/collections/all" replace />} />
                <Route path="/collections/women" element={<Navigate to="/collections/all" replace />} />
                <Route path="/collections/:handle" element={<CollectionPage />} />
                <Route path="/search" element={<CollectionPage mode="search" />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                <Route path="/account/login" element={<AuthPage />} />
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/pages/:slug" element={<InfoPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <CartDrawer />
          <Toaster position="bottom-center" toastOptions={{ style: { borderRadius: 0, fontFamily: 'Inter, sans-serif' } }} />
        </IntroProvider>
      </CartProvider>
    </AuthProvider>
  );
}
