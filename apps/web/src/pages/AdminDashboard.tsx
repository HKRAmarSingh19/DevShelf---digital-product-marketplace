import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  Package,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { adminApi } from '../services/api.js';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sellers' | 'products' | 'users' | 'audit'>('sellers');

  const loadAdminData = async () => {
    try {
      const [ov, sellers, prods, usrs, logs] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getSellerApplications(),
        adminApi.getPendingProducts(),
        adminApi.getUsers(1),
        adminApi.getAuditLogs(),
      ]);
      setOverview(ov);
      setPendingSellers(sellers || []);
      setPendingProducts(prods || []);
      setUsers(usrs?.users || []);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleSellerDecision = async (userId: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await adminApi.decideSellerApplication(userId, decision, 'Moderated from Admin Panel');
      await loadAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update seller');
    }
  };

  const handleProductModeration = async (productId: string, decision: 'PUBLISHED' | 'REJECTED') => {
    try {
      await adminApi.moderateProduct(productId, decision, 'Reviewed by Marketplace Admin');
      await loadAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to moderate product');
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminApi.updateUserStatus(userId, nextStatus, 'Admin status adjustment');
      await loadAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
          Marketplace Administration & Moderation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review seller applications, moderate submitted products, inspect platform GMV, and audit security events.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Total Paid Orders (GMV)
          </span>
          <p className="text-3xl font-extrabold text-white">
            ₹{overview?.orders?.gmvInRupees?.toLocaleString() || '0'}
          </p>
          <p className="text-[11px] text-slate-500">
            {overview?.orders?.totalPaidOrders || 0} completed orders
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Registered Users
          </span>
          <p className="text-3xl font-extrabold text-violet-400">
            {overview?.users?.total || 0}
          </p>
          <p className="text-[11px] text-slate-500">{overview?.users?.sellers || 0} approved sellers</p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Pending Sellers
          </span>
          <p className="text-3xl font-extrabold text-amber-400">
            {overview?.users?.pendingSellerApplications || 0}
          </p>
          <p className="text-[11px] text-slate-500">Awaiting creator review</p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Pending Products
          </span>
          <p className="text-3xl font-extrabold text-emerald-400">
            {overview?.products?.pendingModeration || 0}
          </p>
          <p className="text-[11px] text-slate-500">{overview?.products?.published || 0} published online</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'sellers', label: `Seller Applications (${pendingSellers.length})` },
          { id: 'products', label: `Pending Products (${pendingProducts.length})` },
          { id: 'users', label: 'User Directory' },
          { id: 'audit', label: 'Audit Trail' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Pending Creator Seller Applications</h2>
          {pendingSellers.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-6 glass-card rounded-2xl">
              No pending seller applications.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingSellers.map((app) => (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">{app.name}</h3>
                    <p className="text-xs text-slate-400">{app.email}</p>
                    <p className="text-xs text-slate-300 mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      "{app.application?.bio || 'No bio provided'}"
                    </p>
                    {app.application?.portfolioUrl && (
                      <a
                        href={app.application.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-violet-400 underline block pt-1"
                      >
                        Portfolio: {app.application.portfolioUrl}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleSellerDecision(app.id, 'APPROVED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Seller
                    </button>
                    <button
                      onClick={() => handleSellerDecision(app.id, 'REJECTED')}
                      className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Pending Digital Product Submissions</h2>
          {pendingProducts.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-6 glass-card rounded-2xl">
              No products awaiting review.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-6 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">{p.title}</h3>
                    <p className="text-xs text-slate-400">
                      Seller: {p.seller?.name} ({p.seller?.email}) • ₹{p.priceInRupees}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2">{p.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleProductModeration(p.id, 'PUBLISHED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Publish to Marketplace
                    </button>
                    <button
                      onClick={() => handleProductModeration(p.id, 'REJECTED')}
                      className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl glass-card">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Seller Status</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {u.name} <br />
                    <span className="text-[11px] text-slate-400 font-normal">{u.email}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono">{u.role}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700">
                      {u.sellerStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleUserStatusToggle(u.id, u.status)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                    >
                      {u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="overflow-x-auto rounded-2xl glass-card">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Admin Email</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Resource</th>
                <th className="px-5 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log._id || log.id} className="hover:bg-slate-800/40">
                  <td className="px-5 py-3.5 font-semibold text-white">{log.userEmail}</td>
                  <td className="px-5 py-3.5 font-mono text-violet-400">{log.action}</td>
                  <td className="px-5 py-3.5 text-slate-400">{log.resource}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
