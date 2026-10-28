import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { AppRouter } from './router.js';
import { useAuthStore } from '../stores/authStore.js';

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#0B0F19]">
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
