import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  FolderLock,
  Calendar,
  Layers,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { libraryApi } from '../services/api.js';

export const BuyerDashboard: React.FC = () => {
  const [library, setLibrary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadLibrary() {
      try {
        const data = await libraryApi.getMyLibrary();
        setLibrary(data || []);
      } catch (err) {
        console.error('Failed to load library', err);
      } finally {
        setLoading(false);
      }
    }
    loadLibrary();
  }, []);

  const handleDownload = async (productId: string, title: string) => {
    setDownloadingId(productId);
    try {
      const result = await libraryApi.download(productId);
      if (result?.signedUrl) {
        // Trigger download via signed short-lived URL
        const link = document.createElement('a');
        link.href = result.signedUrl;
        link.download = result.filename || `${title}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Download authorization failed');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderLock className="w-8 h-8 text-violet-400" />
            My Digital Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lifetime access and private signed downloads for your verified product purchases.
          </p>
        </div>

        <Link
          to="/explore"
          className="px-4 py-2 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white border border-violet-500/30 text-xs font-semibold transition-all inline-flex items-center gap-2 self-start"
        >
          <Layers className="w-4 h-4" /> Browse More Products
        </Link>
      </div>

      {/* Library Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : library.length === 0 ? (
        <div className="text-center py-24 rounded-2xl glass-card space-y-4">
          <FolderLock className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Library is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't purchased any digital products yet. Once you purchase templates or code, they will permanently appear here.
          </p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold inline-block"
          >
            Explore DevShelf Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {library.map((item) => {
            const prod = item.product || {};
            return (
              <div
                key={item.id}
                className="rounded-2xl glass-card overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] w-full bg-slate-800 relative">
                    <img
                      src={
                        prod.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'
                      }
                      alt={prod.title || 'Product'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase backdrop-blur">
                      Active Entitlement
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <Link to={`/products/${prod.slug}`}>
                      <h3 className="font-bold text-white text-base hover:text-violet-400 transition-colors line-clamp-1">
                        {prod.title || 'Purchased Resource'}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>

                    <div className="pt-2 text-[11px] text-slate-500 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>License:</span>
                        <span className="text-slate-300">{item.licenseType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Ref:</span>
                        <span className="text-slate-300">{item.orderNumber || 'Verified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Purchased:</span>
                        <span className="text-slate-300">
                          {new Date(item.purchasedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Downloads:</span>
                        <span className="text-slate-300">{item.downloadCount} times</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleDownload(item.productId, prod.title)}
                    disabled={downloadingId === item.productId}
                    className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {downloadingId === item.productId ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authorizing Download...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Download Private Asset
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
