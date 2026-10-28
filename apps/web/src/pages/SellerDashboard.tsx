import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Package,
  PlusCircle,
  Upload,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
} from 'lucide-react';
import { sellerApi, productApi, uploadApi, categoryApi } from '../services/api.js';

export const SellerDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newType, setNewType] = useState('SOURCE_CODE');
  const [newPrice, setNewPrice] = useState(499);
  const [newTags, setNewTags] = useState('react, mern, template');
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productFormMsg, setProductFormMsg] = useState('');

  // Version modal state
  const [versionModalProdId, setVersionModalProdId] = useState<string | null>(null);
  const [versionNumber, setVersionNumber] = useState('');
  const [versionChangelog, setVersionChangelog] = useState('');
  const [versionFile, setVersionFile] = useState<File | null>(null);
  const [uploadingVersion, setUploadingVersion] = useState(false);
  const [versionMsg, setVersionMsg] = useState('');

  const loadData = async () => {
    try {
      const [dash, prods, cats] = await Promise.all([
        sellerApi.getDashboard(),
        sellerApi.getProducts(),
        categoryApi.list(),
      ]);
      setDashboard(dash);
      setProducts(prods || []);
      setCategories(cats || []);
      if (cats && cats.length > 0 && !newCategoryId) {
        setNewCategoryId(cats[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProduct(true);
    setProductFormMsg('');

    try {
      await productApi.create({
        title: newTitle,
        description: newDescription,
        categoryId: newCategoryId,
        productType: newType,
        priceInRupees: Number(newPrice),
        tags: newTags.split(',').map((t) => t.trim()),
      });

      setProductFormMsg('Product draft created successfully! Upload files and submit for review.');
      setNewTitle('');
      setNewDescription('');
      setIsCreatingProduct(false);
      await loadData();
    } catch (err: any) {
      setProductFormMsg(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await productApi.submitForReview(id);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit for review');
    }
  };

  const handlePublishVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionModalProdId || !versionFile) {
      setVersionMsg('Please select a digital asset file');
      return;
    }

    setUploadingVersion(true);
    setVersionMsg('');

    try {
      // 1. Upload private file to storage adapter
      const uploaded = await uploadApi.uploadFile(versionFile);

      // 2. Publish version record
      await productApi.addVersion(versionModalProdId, {
        version: versionNumber,
        changelog: versionChangelog,
        storageKey: uploaded.storageKey,
        originalFilename: uploaded.originalFilename,
        fileSizeBytes: uploaded.fileSizeBytes,
      });

      setVersionModalProdId(null);
      setVersionNumber('');
      setVersionChangelog('');
      setVersionFile(null);
      await loadData();
    } catch (err: any) {
      setVersionMsg(err.response?.data?.message || 'Failed to publish version');
    } finally {
      setUploadingVersion(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            Seller Intelligence & Products Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track gross marketplace volume, commission breakdowns, and publish new digital releases.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingProduct(!isCreatingProduct)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 self-start shadow-lg shadow-violet-600/30"
        >
          <PlusCircle className="w-4 h-4" />
          {isCreatingProduct ? 'Cancel' : 'Publish New Product'}
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Net Creator Earnings
          </span>
          <p className="text-3xl font-extrabold text-emerald-400">
            ₹{dashboard?.earnings?.netEarningsInRupees?.toLocaleString() || '0'}
          </p>
          <p className="text-[11px] text-slate-500">Available for payout ledger</p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Gross Sales Volume
          </span>
          <p className="text-3xl font-extrabold text-white">
            ₹{dashboard?.earnings?.grossSalesInRupees?.toLocaleString() || '0'}
          </p>
          <p className="text-[11px] text-slate-500">Total verified buyer volume</p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Platform Fees (10%)
          </span>
          <p className="text-3xl font-extrabold text-slate-300">
            ₹{dashboard?.earnings?.platformFeesInRupees?.toLocaleString() || '0'}
          </p>
          <p className="text-[11px] text-slate-500">Automated ledger deductions</p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Total Sales Count
          </span>
          <p className="text-3xl font-extrabold text-violet-400">
            {dashboard?.earnings?.totalSalesCount || 0}
          </p>
          <p className="text-[11px] text-slate-500">Total customer orders fulfilled</p>
        </div>
      </div>

      {/* Product Creation Drawer/Card */}
      {isCreatingProduct && (
        <form
          onSubmit={handleCreateProduct}
          className="p-6 sm:p-8 rounded-2xl glass-card space-y-6 border border-violet-500/40 shadow-2xl"
        >
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-violet-400" />
            Create Digital Product Draft
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js SaaS Starter with Authentication"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 text-sm text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
                className="w-full bg-slate-900 text-sm text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Product Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-slate-900 text-sm text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
              >
                <option value="SOURCE_CODE">Source Code</option>
                <option value="EBOOK">E-Book</option>
                <option value="UI_KIT">UI Kit</option>
                <option value="COURSE">Course</option>
                <option value="DEVELOPER_TOOL">Developer Tool</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Price in Rupees (INR)</label>
              <input
                type="number"
                min={0}
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full bg-slate-900 text-sm text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tags (comma-separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full bg-slate-900 text-sm text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Detailed Description & Docs</label>
            <textarea
              rows={4}
              required
              placeholder="Describe your tech stack, features, installation steps, and what buyers will receive..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-slate-900 text-sm text-slate-100 p-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {productFormMsg && <p className="text-xs text-violet-400">{productFormMsg}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreatingProduct(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingProduct}
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30"
            >
              {submittingProduct ? 'Saving Draft...' : 'Save Draft Product'}
            </button>
          </div>
        </form>
      )}

      {/* Managed Products Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Package className="w-5 h-5 text-violet-400" />
          My Published & Draft Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="p-8 rounded-2xl glass-card text-center space-y-2">
            <p className="text-sm text-slate-400">No products uploaded yet.</p>
            <button
              onClick={() => setIsCreatingProduct(true)}
              className="text-xs text-violet-400 font-semibold"
            >
              Create your first product draft
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl glass-card">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Product Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Version</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">
                      <Link to={`/products/${p.slug}`} className="hover:text-violet-400">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{p.categoryName}</td>
                    <td className="px-5 py-4 font-mono font-bold text-white">
                      ₹{p.priceInRupees.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      {p.status === 'PUBLISHED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          PUBLISHED
                        </span>
                      )}
                      {p.status === 'DRAFT' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                          DRAFT
                        </span>
                      )}
                      {p.status === 'PENDING_REVIEW' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          IN MODERATION
                        </span>
                      )}
                      {p.status === 'REJECTED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          REJECTED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-violet-400">v{p.currentVersion}</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      {p.status === 'DRAFT' && (
                        <button
                          onClick={() => handleSubmitForReview(p.id)}
                          className="px-2.5 py-1 rounded bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white border border-violet-500/30 text-[11px] font-semibold transition-colors"
                        >
                          Submit for Review
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setVersionModalProdId(p.id);
                          setVersionNumber('1.1.0');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
                      >
                        Publish Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Version Release Modal */}
      {versionModalProdId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handlePublishVersion}
            className="w-full max-w-md rounded-2xl glass-card p-6 space-y-4 border border-violet-500/40 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">Publish New Product Version</h3>
            <p className="text-xs text-slate-400">
              Upload the new zip or pdf package and provide a changelog for eligible buyers.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Semver Version (e.g. 1.1.0)</label>
              <input
                type="text"
                required
                value={versionNumber}
                onChange={(e) => setVersionNumber(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Changelog</label>
              <textarea
                rows={3}
                required
                placeholder="What changes, bugfixes, or features were added in this release?"
                value={versionChangelog}
                onChange={(e) => setVersionChangelog(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Select Digital Asset File (.zip, .pdf)</label>
              <input
                type="file"
                required
                onChange={(e) => setVersionFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-900 text-xs text-slate-400 p-2 rounded-lg border border-slate-700 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-violet-600 file:text-white"
              />
            </div>

            {versionMsg && <p className="text-xs text-rose-400">{versionMsg}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVersionModalProdId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploadingVersion}
                className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                {uploadingVersion ? 'Uploading...' : 'Publish Release'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
