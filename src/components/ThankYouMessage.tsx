'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { formatPrice } from '@/utils';

interface ThankYouMessageProps {
  order: Order;
}

export function ThankYouMessage({ order }: ThankYouMessageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Confetti particles */}
      <div className="confetti-container" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`confetti confetti-${i % 6}`} />
        ))}
      </div>

      <div className="max-w-md w-full text-center thank-you-card">
        <div className="bg-card rounded-2xl border border-border p-8 sm:p-10 shadow-lg">
          {/* Animated Checkmark */}
          <div className="checkmark-circle">
            <svg className="checkmark-svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          {/* Thank You Text */}
          <h1 className="thank-you-title text-3xl font-bold text-foreground mb-2">
            Thank You!
          </h1>
          <p className="thank-you-subtitle text-muted mb-6">
            Your order has been placed successfully
          </p>

          {/* Order Details */}
          <div className="thank-you-details bg-background rounded-xl px-6 py-5 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted uppercase tracking-wider">Order ID</span>
              <span className="text-lg font-bold text-accent">#{order.id}</span>
            </div>
            <div className="border-t border-border" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted uppercase tracking-wider">Items</span>
              <span className="text-sm font-medium">{order.items.length} item(s)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted uppercase tracking-wider">Total</span>
              <span className="text-sm font-bold text-accent">{formatPrice(order.total)}</span>
            </div>
            {order.formData.kitchenNotes && (
              <>
                <div className="border-t border-border" />
                <div>
                  <span className="text-xs text-muted uppercase tracking-wider block mb-1">Kitchen Notes</span>
                  <p className="text-sm text-foreground/80 bg-card rounded-lg px-3 py-2 border border-border">
                    {order.formData.kitchenNotes}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* WhatsApp Notice */}
          <div className="thank-you-whatsapp bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6">
            <p className="text-sm text-green-800">
              We&apos;ll send your order details to Your WhatsApp Number.
            </p>
          </div>

          {/* Back to Menu */}
          <Link
            href="/"
            className="thank-you-btn block w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 text-sm tracking-wide uppercase"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
