import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Layers, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '../services/api.js';
import { useAuthStore } from '../stores/authStore.js';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authApi.login({ email, password });
      setUser(user);
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back to DevShelf</h1>
        <p className="text-xs text-slate-400">Sign in to access your library, storefront, or orders.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-card space-y-5 shadow-2xl">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="email"
              required
              placeholder="you@developer.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};
