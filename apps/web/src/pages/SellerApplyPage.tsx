import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { sellerApi } from '../services/api.js';
import { useAuthStore } from '../stores/authStore.js';

export const SellerApplyPage: React.FC = () => {
  const { user, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [categories, setCategories] = useState<string[]>(['Source Code', 'Templates']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/seller/apply');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sellerApi.apply({
        bio,
        portfolioUrl: portfolioUrl || undefined,
        githubUrl: githubUrl || undefined,
        categoriesInterested: categories,
      });
      await checkAuth();
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Application submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted || user?.sellerStatus === 'PENDING') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Application Under Review</h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Your creator application has been submitted to DevShelf marketplace moderation. Once approved, you will be able to publish products, upload private packages, and manage your sales ledger.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
          Creator Application
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Become a DevShelf Seller</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Join thousands of developers turning production code and guides into verified digital income.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-card space-y-5 shadow-2xl">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Creator Bio & Experience</label>
          <textarea
            rows={4}
            required
            placeholder="Tell us about the software, templates, or educational material you build (minimum 20 characters)..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Portfolio or Website URL (Optional)</label>
          <input
            type="url"
            placeholder="https://yourportfolio.dev"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">GitHub Profile URL (Optional)</label>
          <input
            type="url"
            placeholder="https://github.com/yourhandle"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting Application...' : 'Submit Seller Application'}
        </button>
      </form>
    </div>
  );
};
