'use client';

import Image from 'next/image';
import { CartItem } from '@/types';
import { formatPrice, getDeliveryCharge, isFreeDelivery } from '@/utils';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  orderType?: 'pickup' | 'delivery';
}

export function OrderSummary({ items, subtotal, orderType = 'delivery' }: OrderSummaryProps) {
  const deliveryCharge = orderType === 'delivery' ? getDeliveryCharge(subtotal) : 0;
  const freeDelivery = orderType === 'delivery' && isFreeDelivery(subtotal);
  const total = subtotal + deliveryCharge;

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
        Order Summary
      </h2>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 py-2 border-b border-border last:border-0">
            {item.product.image && (
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/10">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.product.name}</p>
              <div className="text-xs text-muted space-y-0.5">
                {item.selectedSize && <p>{item.selectedSize}</p>}
                {item.selectedQuantity && <p>{item.selectedQuantity}</p>}
                {item.selectedSauces && item.selectedSauces.length > 0 && (
                  <p>{item.selectedSauces.join(', ')}</p>
                )}
                {item.pizzaFlavor && <p>Pizza: {item.pizzaFlavor}</p>}
                {item.drinkChoice && <p>Drink: {item.drinkChoice}</p>}
                {item.extraCheese && <p>Extra Cheese</p>}
                {item.cheeseSlice && <p>Cheese Slice</p>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium">{formatPrice(item.totalPrice * item.quantity)}</p>
              {item.quantity > 1 && (
                <p className="text-xs text-muted">x{item.quantity}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {orderType === 'delivery' && (
          <div className="flex items-center justify-between text-sm">
            <span>Delivery</span>
            {freeDelivery ? (
              <span className="text-green-500 font-medium">FREE</span>
            ) : (
              <span>{formatPrice(deliveryCharge)}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-base font-semibold border-t border-border pt-2">
          <span>Total</span>
          <span className="text-accent">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
