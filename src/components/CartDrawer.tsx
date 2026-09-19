'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice, isFreeDelivery } from '@/utils';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, totalItems, subtotal, updateQuantity, removeItem } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [slideId, setSlideId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);

  const handleDelete = useCallback((id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 300);
  }, [removeItem]);

  const handleTouchStart = useCallback((id: string, e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((id: string, e: React.TouchEvent) => {
    const diff = touchStartX.current - e.touches[0].clientX;
    if (diff > 50) {
      setSlideId(id);
    } else if (diff < -20) {
      setSlideId(null);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartX.current = 0;
  }, []);

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-96 bg-background shadow-xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">
            YOUR CART {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary/10 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted mb-4">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <p className="text-foreground/60 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 sm:pb-4 pb-24">
              {items.map((item) => {
                const isRemoving = removingId === item.id;
                const isSlid = slideId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 ease-out ${
                      isRemoving ? 'opacity-0 scale-95 -translate-x-full max-h-0 mb-0 py-0 border-0' : 'opacity-100 scale-100 max-h-40'
                    }`}
                  >
                    {/* Delete background revealed on swipe */}
                    <div className="absolute inset-0 flex items-center justify-end pr-6 bg-red-500 rounded-xl">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </div>

                    {/* Card content */}
                    <div
                      className={`relative flex gap-3 p-3 bg-card border border-border rounded-xl transition-transform duration-300 ease-out ${
                        isSlid ? '-translate-x-20' : 'translate-x-0'
                      }`}
                      onTouchStart={(e) => handleTouchStart(item.id, e)}
                      onTouchMove={(e) => handleTouchMove(item.id, e)}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Image */}
                      {item.product.image && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/10">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 cursor-pointer active:scale-90"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                        <div className="text-xs text-muted mt-0.5 space-y-0.5">
                          {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                          {item.selectedQuantity && <p>Qty: {item.selectedQuantity}</p>}
                          {item.selectedSauces && item.selectedSauces.length > 0 && (
                            <p>Sauces: {item.selectedSauces.join(', ')}</p>
                          )}
                          {item.pizzaFlavor && <p>Pizza: {item.pizzaFlavor}</p>}
                          {item.drinkChoice && <p>Drink: {item.drinkChoice}</p>}
                          {item.extraCheese && <p>Extra Cheese</p>}
                          {item.cheeseSlice && <p>Cheese Slice</p>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-medium text-sm text-accent">{formatPrice(item.totalPrice * item.quantity)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-secondary/10 transition-colors cursor-pointer text-sm"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-secondary/10 transition-colors cursor-pointer text-sm"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 sm:static border-t border-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-shrink-0 z-10 bg-background">
              {!isFreeDelivery(subtotal) && (
                <p className="text-xs text-muted mb-2">
                  Add {formatPrice(500 - subtotal)} more for free delivery
                </p>
              )}
              {isFreeDelivery(subtotal) && (
                <p className="text-xs text-green-500 font-medium mb-2">
                  You qualify for free delivery!
                </p>
              )}
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted font-medium">Subtotal</p>
                  <p className="text-lg font-bold text-accent">{formatPrice(subtotal)}</p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="flex-shrink-0 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 active:scale-[0.97] transition-all duration-200 cursor-pointer text-sm"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
