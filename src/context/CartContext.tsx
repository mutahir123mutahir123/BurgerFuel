'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, CartState, CheckoutFormData, Order } from '@/types';
import { generateOrderId } from '@/utils';

interface CartContextType extends CartState {
  lastOrder: Order | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (formData: CheckoutFormData) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const placeOrder = useCallback((formData: CheckoutFormData): string => {
    const orderId = generateOrderId();
    const order: Order = {
      id: orderId,
      items: [...items],
      formData,
      total: subtotal,
      status: 'pending',
      createdAt: new Date(),
    };
    setLastOrder(order);
    setItems([]);
    return orderId;
  }, [items, subtotal]);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      subtotal,
      lastOrder,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      placeOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
