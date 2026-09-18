'use client';

import { useState } from 'react';
import { CheckoutFormData } from '@/types';

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => void;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+\-()]{7,}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (orderType === 'delivery' && !address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      orderType,
      name: name.trim(),
      phone: phone.trim(),
      address: orderType === 'delivery' ? address.trim() : undefined,
      kitchenNotes: kitchenNotes.trim() || undefined,
      paymentMethod: 'cash_on_delivery',
    });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-background text-foreground text-sm outline-none transition-colors ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-accent'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Type */}
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 block">
          Order Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
              orderType === 'delivery'
                ? 'border-accent bg-accent/5 text-foreground'
                : 'border-border hover:border-accent/40 text-foreground/70'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path d="M3 9l2.45-4.9A2 2 0 017.24 3h9.52a2 2 0 011.8 1.1L21 9" />
              <circle cx="12" cy="15" r="2" />
            </svg>
            DELIVERY
          </button>
          <button
            type="button"
            onClick={() => setOrderType('pickup')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
              orderType === 'pickup'
                ? 'border-accent bg-accent/5 text-foreground'
                : 'border-border hover:border-accent/40 text-foreground/70'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21V8l9-5 9 5v13" />
              <path d="M9 21v-6h6v6" />
            </svg>
            PICKUP
          </button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
          Customer Information
        </p>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1.5">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className={inputClass('name')}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground/80 mb-1.5">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="03XX XXXXXXX"
            className={inputClass('phone')}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {orderType === 'delivery' && (
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-foreground/80 mb-1.5">
              Delivery Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full delivery address"
              rows={3}
              className={`${inputClass('address')} resize-none`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>
        )}

        <div>
          <label htmlFor="kitchenNotes" className="block text-sm font-medium text-foreground/80 mb-1.5">
            Kitchen Notes <span className="text-muted text-xs">(optional)</span>
          </label>
          <textarea
            id="kitchenNotes"
            value={kitchenNotes}
            onChange={(e) => setKitchenNotes(e.target.value)}
            placeholder="e.g. No extra sauce, extra crispy, less spicy..."
            rows={2}
            className={`${inputClass('kitchenNotes')} resize-none`}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Payment Method
        </p>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-accent bg-accent/5">
          <span className="w-4 h-4 rounded-full border-[6px] border-accent" />
          <span className="text-sm font-medium">Cash on Delivery</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm tracking-wide uppercase"
      >
        Place Order
      </button>
    </form>
  );
}
