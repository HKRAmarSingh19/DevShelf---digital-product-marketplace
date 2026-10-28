import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '../services/api.js';
import { useAuthStore } from '../stores/authStore.js';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authApi.register({ name, email, password });
      setUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Create your DevShelf Account</h1>
        <p className="text-xs text-slate-400">Join creators and developers building digital software.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-card space-y-5 shadow-2xl">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Full Name</label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="email"
              required
              placeholder="you@domain.com"
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
              placeholder="Min 8 chars, 1 uppercase, 1 number"
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
          {loading ? 'Creating Account...' : 'Get Started Free'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};
