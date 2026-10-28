import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  FolderOpen,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { productApi, categoryApi } from '../services/api.js';
import { useCartStore } from '../stores/cartStore.js';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const { addItem, isInCart } = useCartStore();

  const searchQuery = searchParams.get('search') || '';
  const selectedCategorySlug = searchParams.get('category') || '';
  const selectedType = searchParams.get('type') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await categoryApi.list();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let categoryId: string | undefined;
        if (selectedCategorySlug && categories.length > 0) {
          const match = categories.find((c) => c.slug === selectedCategorySlug);
          if (match) categoryId = match._id;
        }

        const data = await productApi.list({
          search: searchQuery,
          categoryId,
          productType: selectedType || undefined,
          sortBy,
          page: searchParams.get('page') || 1,
        });

        setProducts(data?.products || []);
        if (data?.pagination) {
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchParams, categories]);

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Search */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Digital Catalogue</h1>
        <p className="text-sm text-slate-400">
          Browse verified software boilerplates, architecture books, UI kits, and creator tools.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by keywords, tags, frameworks..."
            value={searchQuery}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full bg-slate-900 text-slate-200 pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Main Filter & Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl glass-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                Filter Products
              </span>
              {(selectedCategorySlug || selectedType || searchQuery) && (
                <button
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Categories filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    !selectedCategorySlug
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.slug}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Product Type
              </label>
              <div className="space-y-1">
                {[
                  { id: '', label: 'All Types' },
                  { id: 'SOURCE_CODE', label: 'Source Code' },
                  { id: 'EBOOK', label: 'E-Books' },
                  { id: 'UI_KIT', label: 'UI Kits' },
                  { id: 'COURSE', label: 'Courses' },
                  { id: 'DEVELOPER_TOOL', label: 'Developer Tools' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateParam('type', t.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedType === t.id
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400">
              Showing <span className="text-white font-bold">{products.length}</span> of {pagination.total} products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-violet-500"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-800/40 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl glass-card space-y-4">
              <FolderOpen className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No products match your search</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search terms or clearing selected category filters.
              </p>
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-violet-600 text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl glass-card overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all group"
                >
                  <div>
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
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-semibold text-white uppercase border border-white/10">
                        {prod.productType.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate max-w-[130px]">
                          {prod.category?.name || 'Resource'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {prod.averageRating > 0 ? prod.averageRating.toFixed(1) : 'New'}
                          {prod.reviewCount > 0 && ` (${prod.reviewCount})`}
                        </div>
                      </div>

                      <Link to={`/products/${prod.slug}`}>
                        <h3 className="font-bold text-slate-100 text-sm group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                          {prod.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Price</span>
                      <span className="text-base font-bold text-white">
                        ₹{(prod.priceInRupees || prod.priceInPaise / 100).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          addItem({
                            id: prod.id,
                            title: prod.title,
                            slug: prod.slug,
                            priceInRupees: prod.priceInRupees || prod.priceInPaise / 100,
                            thumbnailUrl: prod.thumbnailUrl,
                            sellerName: prod.seller?.name,
                          })
                        }
                        className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                          isInCart(prod.id)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                        title={isInCart(prod.id) ? 'Added in Cart' : 'Add to Cart'}
                      >
                        {isInCart(prod.id) ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                      </button>

                      <Link
                        to={`/products/${prod.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
