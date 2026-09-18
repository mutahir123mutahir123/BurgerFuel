'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lastOrder } = useCart();
  const orderId = searchParams.get('id');

  useEffect(() => {
    if (!orderId || !lastOrder || lastOrder.id !== orderId) {
      router.replace('/');
    }
  }, [orderId, lastOrder, router]);

  if (!orderId || !lastOrder || lastOrder.id !== orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-card rounded-2xl border border-border p-8 sm:p-10">
          {/* Checkmark */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-foreground mb-2">THANK YOU!</h1>
          <p className="text-muted mb-6">Your order has been placed.</p>

          {/* Order ID */}
          <div className="bg-background rounded-xl px-6 py-4 mb-8">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Order ID</p>
            <p className="text-xl font-bold text-accent">#{orderId}</p>
          </div>

          {/* Back to Menu */}
          <Link
            href="/"
            className="block w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 text-sm tracking-wide uppercase"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
