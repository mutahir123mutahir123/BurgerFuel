'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CheckoutForm } from '@/components/CheckoutForm';
import { OrderSummary } from '@/components/OrderSummary';
import { ThankYouMessage } from '@/components/ThankYouMessage';
import { CheckoutFormData, Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, placeOrder } = useCart();
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (items.length === 0 && !completedOrder) {
      router.replace('/');
    }
  }, [items.length, completedOrder, router]);

  useEffect(() => {
    if (completedOrder) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [completedOrder]);

  if (items.length === 0 && !completedOrder) {
    return null;
  }

  const handlePlaceOrder = (formData: CheckoutFormData) => {
    const orderId = placeOrder(formData);
    const order: Order = {
      id: orderId,
      items: [...items],
      formData,
      total: subtotal,
      status: 'pending',
      createdAt: new Date(),
    };
    setCompletedOrder(order);
  };

  if (completedOrder) {
    return <ThankYouMessage order={completedOrder} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Summary - shows first on mobile */}
          <div className="lg:col-span-2 lg:order-last">
            <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 lg:sticky lg:top-36">
              <OrderSummary items={items} subtotal={subtotal} />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
              <CheckoutForm onSubmit={handlePlaceOrder} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
