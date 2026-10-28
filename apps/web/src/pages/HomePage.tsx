import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Code2,
  BookOpen,
  Layout,
  GraduationCap,
  Terminal,
  Star,
  Download,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { productApi, categoryApi } from '../services/api.js';

export const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          categoryApi.list(),
          productApi.list({ limit: 6, sortBy: 'rating' }),
        ]);
        setCategories(cats || []);
        setFeaturedProducts(prods?.products || []);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'source-code':
        return <Code2 className="w-6 h-6 text-violet-400" />;
      case 'ebooks':
        return <BookOpen className="w-6 h-6 text-indigo-400" />;
      case 'ui-kits':
        return <Layout className="w-6 h-6 text-fuchsia-400" />;
      case 'courses':
        return <GraduationCap className="w-6 h-6 text-sky-400" />;
      default:
        return <Terminal className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            The Multi-Vendor Marketplace for Software Craftsmen
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Create. Sell. Share. <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
              Grow with DevShelf.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover peer-reviewed developer boilerplates, system design e-books, full-stack templates, and UI design kits crafted by top creators.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative pt-4">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                placeholder="Search templates, full-stack code, ebooks, UI kits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 text-slate-100 pl-12 pr-32 py-4 rounded-2xl border border-slate-700/80 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-sm sm:text-base shadow-2xl transition-all placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all"
              >
                Explore
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="text-slate-500 font-mono">Popular:</span>
            {['MERN Stack', 'System Design', 'React Starter', 'Tailwind Kit', 'Next.js'].map((tag) => (
              <Link
                key={tag}
                to={`/explore?search=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/40 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Popular Categories</h2>
            <p className="text-sm text-slate-400">Curated digital collections tailored for engineering teams</p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/explore?category=${cat.slug}`}
              className="p-5 rounded-2xl glass-card flex flex-col items-start gap-3 hover:-translate-y-1 transition-all group"
            >
              <div className="p-3 rounded-xl bg-slate-800/80 group-hover:bg-violet-600/20 transition-colors">
                {getCategoryIcon(cat.slug)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {cat.description || 'Explore verified assets'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              Verified & High Rated
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Digital Products</h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            View Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-800/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl glass-card overflow-hidden flex flex-col hover:-translate-y-1 transition-all group"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden">
                  <img
                    src={
                      prod.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop'
                    }
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[11px] font-semibold text-white uppercase tracking-wider border border-white/10">
                    {prod.productType.replace('_', ' ')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{prod.category?.name || 'Developer Resource'}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {prod.averageRating > 0 ? prod.averageRating.toFixed(1) : 'New'}
                        {prod.reviewCount > 0 && ` (${prod.reviewCount})`}
                      </div>
                    </div>

                    <Link to={`/products/${prod.slug}`}>
                      <h3 className="font-bold text-slate-100 text-base group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                        {prod.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Price</span>
                      <span className="text-lg font-bold text-white">
                        ₹{prod.priceInRupees ? prod.priceInRupees.toLocaleString() : (prod.priceInPaise / 100).toLocaleString()}
                      </span>
                    </div>

                    <Link
                      to={`/products/${prod.slug}`}
                      className="px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white font-semibold text-xs transition-all border border-violet-500/30"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Creator Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-violet-500/20 bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Start Selling Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Turn your digital creations into continuous creator income.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Publish boilerplate code, themes, plugins, and guides. DevShelf takes care of instant Razorpay checkout, private signed downloads, automated versioning, and verified buyer reviews.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/seller/apply"
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
              >
                Apply as Seller <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
