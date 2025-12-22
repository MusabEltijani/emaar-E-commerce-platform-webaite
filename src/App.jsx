import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Loader from './components/common/Loader';
import AppErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Categories = lazy(() => import('./pages/Categories'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Page transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AppErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Helmet>
          <title>Emaar E-commerce</title>
          <meta name="description" content="Emaar E-commerce - Discover the best products at competitive prices" />
        </Helmet>
        <Suspense fallback={<Loader size="lg" className="min-h-screen" />}>
          <AnimatePresence mode="wait">
            <Routes>
            <Route path="/" element={<Layout><PageWrapper><Home /></PageWrapper></Layout>} />
            <Route path="/products" element={<Layout><PageWrapper><Products /></PageWrapper></Layout>} />
            <Route path="/categories" element={<Layout><PageWrapper><Categories /></PageWrapper></Layout>} />
            <Route path="/products/:id" element={<Layout><PageWrapper><ProductDetails /></PageWrapper></Layout>} />
            <Route path="/cart" element={<Layout><PageWrapper><Cart /></PageWrapper></Layout>} />
            <Route
              path="/checkout"
              element={
                <Layout>
                  <ProtectedRoute>
                    <PageWrapper><Checkout /></PageWrapper>
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/orders"
              element={
                <Layout>
                  <ProtectedRoute>
                    <PageWrapper><Orders /></PageWrapper>
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <Layout>
                  <ProtectedRoute>
                    <PageWrapper><OrderDetails /></PageWrapper>
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProtectedRoute>
                    <PageWrapper><Profile /></PageWrapper>
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route path="/login" element={<Layout><PageWrapper><Login /></PageWrapper></Layout>} />
            <Route path="/register" element={<Layout><PageWrapper><Register /></PageWrapper></Layout>} />
            <Route path="/forgot-password" element={<Layout><PageWrapper><ForgotPassword /></PageWrapper></Layout>} />
            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Router>
    </AppErrorBoundary>
  );
}

export default App;

