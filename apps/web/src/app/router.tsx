import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage.js';
import { CatalogPage } from '../pages/CatalogPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { BuyerDashboard } from '../pages/BuyerDashboard.js';
import { SellerDashboard } from '../pages/SellerDashboard.js';
import { SellerApplyPage } from '../pages/SellerApplyPage.js';
import { AdminDashboard } from '../pages/AdminDashboard.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { useAuthStore } from '../stores/authStore.js';

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.sellerStatus !== 'APPROVED' && user.role !== 'ADMIN') {
    return <Navigate to="/seller/apply" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<CatalogPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Buyer Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Seller Routes */}
      <Route
        path="/seller/apply"
        element={
          <ProtectedRoute>
            <SellerApplyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/dashboard"
        element={
          <SellerRoute>
            <SellerDashboard />
          </SellerRoute>
        }
      />

      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
