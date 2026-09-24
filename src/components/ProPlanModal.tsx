'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Lock,
  Cloud,
  Train,
  Hotel,
  Award,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProPlanModal({ isOpen, onClose }: ProPlanModalProps) {
  const { user, isPro, refreshProfile, setIsAuthModalOpen } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamically load Razorpay SDK script
  useEffect(() => {
    if (!isOpen) return;
    const scriptId = 'razorpay-checkout-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setErrorMsg(null);

    // If user is not logged in, prompt to log in first so order can be assigned
    if (!user) {
      onClose();
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const orderData = await res.json();
      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to initialize payment.');
      }

      // Handle test simulation mode if live keys are not plugged in yet
      if (orderData.isMock) {
        // Simulate payment verification
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentId: `pay_mock_${Date.now()}`,
            signature: 'sig_mock_simulation',
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          await refreshProfile();
          setIsSuccess(true);
        } else {
          throw new Error(verifyData.error || 'Verification failed');
        }
        return;
      }

      // 2. Open standard Razorpay Checkout Modal
      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Voyage Pro Explorer',
        description: 'Lifetime Explorer Pass & Cloud Itinerary Sync',
        order_id: orderData.orderId,
        prefill: {
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveler',
          email: user.email || '',
        },
        theme: {
          color: '#d4f938',
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await refreshProfile();
              setIsSuccess(true);
            } else {
              setErrorMsg(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Payment verification network error.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0d1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess || isPro ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#d4f938]/20 border border-[#d4f938]/40 flex items-center justify-center mx-auto text-[#d4f938] animate-bounce">
              <Award className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4f938]/10 text-[#d4f938] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRO STATUS ACTIVE</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Welcome to Voyage Pro!
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your account has been upgraded with unlimited Gemini AI generations, cloud PostgreSQL sync, and priority railway advisors.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#d4f938] hover:bg-[#bde629] text-black font-extrabold text-xs shadow-md transition-all mt-4"
            >
              Start Exploring Now
            </button>
          </div>
        ) : (
          /* Plan Offer Screen */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4f938]/10 border border-[#d4f938]/20 text-[#d4f938] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Special 50% Off Pass</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Upgrade to Voyage Pro
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Unlock the ultimate AI travel toolkit across India with cloud database synchronization.
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-lime-950/40 via-slate-900 to-cyan-950/40 border border-[#d4f938]/30 flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Voyage Pro Explorer Pass
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-white font-mono">₹299</span>
                  <span className="text-xs text-slate-500 line-through">₹599</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold font-mono">
                    50% OFF
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#d4f938] font-mono font-bold">One-time pass</span>
            </div>

            {/* Features Checklist */}
            <div className="space-y-3 mb-6">
              {[
                { icon: Sparkles, text: 'Unlimited Gemini AI Itinerary Generations (Fast Flash 2.0)' },
                { icon: Cloud, text: 'PostgreSQL Cloud Database Sync across all your devices' },
                { icon: Train, text: 'VIP IRCTC 60-Day Seat Availability & Tatkal Timeline Alerts' },
                { icon: Hotel, text: 'Curated 130+ Verified Backpacker Hostels & Stays' },
                { icon: Award, text: 'Exclusive "PRO" Verified Traveler Badge on your profile' },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-5 h-5 rounded-md bg-[#d4f938]/15 text-[#d4f938] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#d4f938] hover:bg-[#bde629] text-black font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-[#d4f938]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Contacting Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{user ? 'Pay ₹299 with Razorpay' : 'Sign In & Upgrade to Pro'}</span>
                </>
              )}
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-bit Encrypted Checkout • UPI, Cards & NetBanking</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
