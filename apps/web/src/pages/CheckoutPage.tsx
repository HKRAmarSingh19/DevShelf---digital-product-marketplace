import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Trash2,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useCartStore } from '../stores/cartStore.js';
import { useAuthStore } from '../stores/authStore.js';
import { checkoutApi } from '../services/api.js';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CheckoutPage: React.FC = () => {
  const { items, removeItem, clearCart, totalInRupees } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // 1. Authoritative server checkout initiation
      const checkoutData = await checkoutApi.initiate(
        items.map((i) => i.id),
        'STANDARD'
      );

      const { orderId, gatewayOrderId, razorpayKeyId, totalInPaise } = checkoutData;

      // 2. Open Razorpay Gateway or simulate test payment
      if (window.Razorpay && razorpayKeyId && !razorpayKeyId.includes('placeholder')) {
        const options = {
          key: razorpayKeyId,
          amount: totalInPaise,
          currency: 'INR',
          name: 'DevShelf Marketplace',
          description: `Digital Purchase Order #${checkoutData.orderNumber}`,
          order_id: gatewayOrderId,
          handler: async (response: any) => {
            try {
              // 3. Verify on server
              await checkoutApi.verify({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              clearCart();
              setSuccess(true);
            } catch (vErr: any) {
              setError(vErr.response?.data?.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#7c3aed',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Safe simulator fallback for local test mode
        const simulatedPaymentId = `pay_sim_${Date.now()}`;
        const simulatedSig = `sig_${gatewayOrderId}_${simulatedPaymentId}`;

        await checkoutApi.verify({
          orderId,
          razorpayOrderId: gatewayOrderId,
          razorpayPaymentId: simulatedPaymentId,
          razorpaySignature: simulatedSig,
        });

        clearCart();
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-white">Payment Confirmed!</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Your digital entitlement has been verified and active access is granted to your personal library.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
          >
            Access My Library <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout & Order Summary</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your digital items and complete payment securely via Razorpay.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-card space-y-4">
          <p className="text-base text-slate-400">Your cart is empty.</p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold inline-block"
          >
            Explore Marketplace Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Selected Digital Products ({items.length})
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl glass-card flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&h=80&fit=crop'
                      }
                      alt={item.title}
                      className="w-16 h-12 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <h3 className="font-semibold text-white text-sm line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-400">Lifetime access • Standard License</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white text-sm">
                      ₹{item.priceInRupees.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Prices verified server-authoritatively against MongoDB records.</span>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl glass-card space-y-6 shadow-2xl">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Order Total
              </h2>

              <div className="space-y-3 text-xs text-slate-400 border-b border-slate-800 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200">₹{totalInRupees().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="text-emerald-400">Included (0%)</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Taxes</span>
                  <span className="text-slate-200">Included</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-200 text-sm">Total Due</span>
                <span className="text-2xl font-extrabold text-white">
                  ₹{totalInRupees().toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Authorizing...' : 'Pay with Razorpay'}
              </button>

              <div className="text-[11px] text-slate-500 text-center space-y-1">
                <p>Protected by 256-bit TLS encryption.</p>
                <p>Instant file access in your personal library upon payment.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
