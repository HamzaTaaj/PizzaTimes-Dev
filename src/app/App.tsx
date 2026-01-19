import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductPage } from './components/ProductPage';
import { ShopifyProductsPage } from './components/ShopifyProductsPage';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { BlogPage } from './components/BlogPage';
import { ManualPage } from './components/ManualPage';
import { RequestAccessPage } from './components/RequestAccessPage';
import { AccountUnderReviewPage } from './components/AccountUnderReviewPage';
import { CartPage } from './components/CartPage';
import { LandingPage } from './components/LandingPage';
import { MarketingPage } from './components/MarketingPage';
import { CompanyPage } from './components/CompanyPage';
import { WhyPizzaAnytimePage } from './components/WhyPizzaAnytimePage';
import { OnsiteSupportPage } from './components/OnsiteSupportPage';
import { ROICalculatorPage } from './components/ROICalculatorPage';
import { PrivacyTermsPage } from './components/PrivacyTermsPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { SupportTicketPage } from './components/SupportTicketPage';
import { Footer } from './components/Footer';
import { ArrowUp } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShopifyConnectionTest } from '../lib/shopify-test';
import { isAuthenticated } from './utils/auth';

// Protected Route Component using AuthContext
function ClientProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}

// Page wrapper with animation
function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="overflow-visible"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 // ✅ ZENDESK CHAT
 useEffect(() => {
  if (document.getElementById("ze-snippet")) return;

  const script = document.createElement("script");
  script.id = "ze-snippet";
  script.src =
    "https://static.zdassets.com/ekr/snippet.js?key=9a4de2e7-87cb-4f7a-ac01-90bfaa2e0d37";
  script.async = true;

  document.body.appendChild(script);
}, []);



  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMarketingPage = location.pathname === '/marketing';

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden overflow-y-visible">
      {!isMarketingPage && <Header />}
      
      
      <main className="overflow-visible">
        <PageWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/shop" element={<ShopifyProductsPage />} />
            <Route path="/shop/:handle" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/account-under-review" element={<AccountUnderReviewPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/manual" element={<ManualPage />} />
            <Route path="/request-access" element={<RequestAccessPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/why-pizza-anytime" element={<WhyPizzaAnytimePage />} />
            <Route path="/onsite-support" element={<OnsiteSupportPage />} />
            <Route path="/roi-calculator" element={<ROICalculatorPage />} />
            <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ClientProtectedRoute>
                  <ClientDashboard />
                </ClientProtectedRoute>
              } 
            />
            <Route 
              path="/support-ticket" 
              element={
                <ClientProtectedRoute>
                  <SupportTicketPage />
                </ClientProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />
          </Routes>
        </PageWrapper>
      </main>

      {!isMarketingPage && <Footer />}

      {/* Scroll to Top Button - Positioned to avoid Zendesk widget overlap */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-8 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 transition-shadow z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Zendesk Widget Position Adjustment */}
      <style>{`
        /* Adjust Zendesk widget position to avoid overlap */
        #launcher {
          bottom: 20px !important;
          right: 20px !important;
        }
        /* Ensure scroll to top button is above Zendesk */
        .fixed.bottom-24 {
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}