import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Zap, DownloadCloud, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070A11] text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DevShelf</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create. Sell. Share. Grow. The premier multi-vendor marketplace for high-performance developer templates, source code, e-books, and design systems.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All systems operational
            </div>
          </div>

          {/* Marketplace Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore?category=source-code" className="hover:text-white transition-colors">
                  Source Code & Starters
                </Link>
              </li>
              <li>
                <Link to="/explore?category=ebooks" className="hover:text-white transition-colors">
                  E-Books & Architecture Guides
                </Link>
              </li>
              <li>
                <Link to="/explore?category=ui-kits" className="hover:text-white transition-colors">
                  UI Kits & Design Systems
                </Link>
              </li>
              <li>
                <Link to="/explore?category=courses" className="hover:text-white transition-colors">
                  Developer Masterclasses
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators & Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Creators
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/seller/apply" className="hover:text-white transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-white transition-colors">
                  Seller Hub & Analytics
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Instant Razorpay Payouts</span>
              </li>
              <li>
                <span className="text-slate-500">10% Flat Marketplace Fee</span>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Security & Guarantees
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Verified creator code & files</span>
              </div>
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Private signed downloads & lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Instant automated entitlement delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DevShelf Inc. Built with MERN, TypeScript, and Razorpay.</p>
          <div className="flex items-center gap-4">
            <span>Server-Authoritative Pricing</span>
            <span>•</span>
            <span>Zero-Trust Private Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
