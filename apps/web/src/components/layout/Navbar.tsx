import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Layers,
  Sparkles,
  ShieldAlert,
  LogOut,
  FolderLock,
  PlusCircle,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useCartStore } from '../../stores/cartStore.js';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  DevShelf
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    Pro
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 tracking-wider block font-mono -mt-1">
                  digital marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/explore"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/explore?category=source-code"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Source Code
              </Link>
              <Link
                to="/explore?category=ebooks"
                className="text-slate-300 hover:text-white transition-colors"
              >
                E-Books
              </Link>
              <Link
                to="/explore?category=ui-kits"
                className="text-slate-300 hover:text-white transition-colors"
              >
                UI Kits
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search code, guides, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 text-sm text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-700/60 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link
              to="/checkout"
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B0F19]">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Become a Seller / Seller portal quick link */}
            {user ? (
              user.sellerStatus === 'APPROVED' ? (
                <Link
                  to="/seller/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Seller Dashboard
                </Link>
              ) : user.sellerStatus === 'PENDING' ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Seller Application Pending
                </span>
              ) : (
                <Link
                  to="/seller/apply"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Become a Seller
                </Link>
              )
            ) : (
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20 transition-all"
              >
                Become a Seller
              </Link>
            )}

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors focus:outline-none"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-200 hidden md:block">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl glass-card py-2 shadow-2xl z-50">
                    <div className="px-4 py-2 border-b border-slate-700/50">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <FolderLock className="w-4 h-4 text-violet-400" />
                      Buyer Library
                    </Link>

                    {user.sellerStatus === 'APPROVED' && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Seller Hub
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Center
                      </Link>
                    )}

                    <div className="border-t border-slate-700/50 mt-1 pt-1">
                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F19] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200"
          >
            Explore Marketplace
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200"
          >
            My Library
          </Link>
          {user?.sellerStatus === 'APPROVED' ? (
            <Link
              to="/seller/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-emerald-400"
            >
              Seller Dashboard
            </Link>
          ) : (
            <Link
              to="/seller/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-violet-400"
            >
              Become a Seller
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-amber-400"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
