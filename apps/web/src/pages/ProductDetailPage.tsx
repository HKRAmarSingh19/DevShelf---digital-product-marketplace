import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Download,
  ShoppingCart,
  Zap,
  GitBranch,
  Calendar,
  MessageSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { productApi, reviewApi, libraryApi } from '../services/api.js';
import { useAuthStore } from '../stores/authStore.js';
import { useCartStore } from '../stores/cartStore.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addItem, isInCart } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState('STANDARD');

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    async function loadProductData() {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await productApi.getBySlug(slug);
        setProduct(prod);

        // Fetch version history and reviews
        const [vers, revs] = await Promise.all([
          productApi.getVersions(prod.id),
          reviewApi.getReviews(prod.id),
        ]);
        setVersions(vers || []);
        setReviews(revs || []);

        // Check if user already owns this product
        if (user) {
          try {
            const library = await libraryApi.getMyLibrary();
            const owned = library?.some((item: any) => item.productId === prod.id);
            setIsOwner(owned);
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [slug, user]);

  const handleBuyNow = () => {
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      priceInRupees: product.priceInRupees || product.priceInPaise / 100,
      thumbnailUrl: product.thumbnailUrl,
      sellerName: product.seller?.name,
    });
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      await reviewApi.createReview(product.id, {
        rating: newRating,
        comment: newComment,
      });
      // Refresh reviews
      const updated = await reviewApi.getReviews(product.id);
      setReviews(updated || []);
      setNewComment('');
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-800 rounded-lg w-2/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-sm text-slate-400">The product you requested does not exist or has been removed.</p>
        <Link to="/explore" className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm inline-block">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/explore" className="hover:text-slate-200">Marketplace</Link>
          <span>/</span>
          <Link to={`/explore?category=${product.category?.slug}`} className="hover:text-slate-200">
            {product.category?.name || 'Resource'}
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-medium">{product.title}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {product.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">{product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}</span>
            <span className="text-slate-400 font-normal">({reviews.length} verified ratings)</span>
          </div>

          <span>•</span>
          <div className="flex items-center gap-1 text-slate-300">
            <span>By</span>
            <span className="font-semibold text-white">{product.seller?.name || 'DevShelf Creator'}</span>
          </div>

          <span>•</span>
          <span className="px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
            v{product.currentVersion}
          </span>
        </div>
      </div>

      {/* Main Grid: Media & Purchase Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Visual */}
          <div className="aspect-[16/9] w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl relative">
            <img
              src={
                product.thumbnailUrl ||
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=700&fit=crop'
              }
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <div className="p-6 sm:p-8 rounded-2xl glass-card space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              Product Overview & Specifications
            </h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Changelog & Version History */}
          <div className="p-6 sm:p-8 rounded-2xl glass-card space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-violet-400" />
              Version History & Updates
            </h2>

            {versions.length === 0 ? (
              <p className="text-xs text-slate-400">Release version 1.0.0 is available for instant download.</p>
            ) : (
              <div className="space-y-4">
                {versions.map((ver) => (
                  <div key={ver.id || ver.version} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-violet-400">v{ver.version}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ver.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{ver.changelog}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      File: {ver.originalFilename} ({(ver.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Reviews Section */}
          <div className="p-6 sm:p-8 rounded-2xl glass-card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                Verified Customer Reviews ({reviews.length})
              </h2>
            </div>

            {/* Leave Review Form (if entitled buyer) */}
            {isOwner && (
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-violet-200">
                    You own this item. Share your feedback:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`p-1 ${newRating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Write your honest review..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-700 focus:border-violet-500 focus:outline-none"
                />

                {reviewError && <p className="text-xs text-rose-400">{reviewError}</p>}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </div>
              </form>
            )}

            {/* Review List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews yet. Be the first verified buyer to leave feedback!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">
                          {rev.buyer?.name || 'Verified Buyer'}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 rounded-2xl glass-card p-6 space-y-6 shadow-2xl">
            {/* Price Header */}
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block">Digital License Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  ₹{(product.priceInRupees || product.priceInPaise / 100).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">INR (Incl. GST)</span>
              </div>
            </div>

            {/* License Option Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                License Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'STANDARD',
                    title: 'Standard License',
                    desc: 'Single commercial or personal project',
                  },
                  {
                    id: 'COMMERCIAL',
                    title: 'Team Commercial',
                    desc: 'Unlimited client work & team deployment',
                  },
                ].map((lic) => (
                  <button
                    key={lic.id}
                    type="button"
                    onClick={() => setSelectedLicense(lic.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedLicense === lic.id
                        ? 'border-violet-500 bg-violet-600/10 text-white'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold">{lic.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{lic.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Ownership State or Buy Actions */}
            {isOwner ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> You own this product
                </div>
                <Link
                  to="/dashboard"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors block"
                >
                  <Download className="w-4 h-4" /> Go to My Library
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </button>

                <button
                  onClick={() =>
                    addItem({
                      id: product.id,
                      title: product.title,
                      slug: product.slug,
                      priceInRupees: product.priceInRupees || product.priceInPaise / 100,
                      thumbnailUrl: product.thumbnailUrl,
                      sellerName: product.seller?.name,
                    })
                  }
                  className={`w-full py-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    isInCart(product.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Guarantees */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Private signed download links</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Lifetime updates & changelogs</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Instant automated access upon payment</span>
              </div>
            </div>

            {/* Creator Badge */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              {product.seller?.avatarUrl ? (
                <img
                  src={product.seller.avatarUrl}
                  alt={product.seller.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
                  {product.seller?.name?.charAt(0) || 'C'}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-white">{product.seller?.name || 'DevShelf Creator'}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{product.seller?.bio || 'Verified Publisher'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
