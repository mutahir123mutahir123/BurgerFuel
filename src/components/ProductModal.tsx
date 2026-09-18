'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Product, PizzaSize, QuantityOption, WrapSauce, PizzaFlavor, DrinkChoice, CartItem } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ALL_SAUCES: WrapSauce[] = [
  'Chipotle',
  'Honey Mustard',
  'Salsa',
  'B.B.Q',
  'Chilli Lava',
  'Peri Peri',
  'Garlic',
];

const SIZE_LABELS: Record<PizzaSize, string> = {
  Small: 'Small (8")',
  Medium: 'Medium (11")',
  Large: 'Large (13")',
};

function getAvailableSizes(prices: Record<PizzaSize, number>): PizzaSize[] {
  return (Object.entries(prices) as [PizzaSize, number][])
    .filter(([, price]) => price > 0)
    .map(([size]) => size);
}

function getAvailableQuantities(prices: Record<QuantityOption, number>): QuantityOption[] {
  return (Object.entries(prices) as [QuantityOption, number][])
    .filter(([, price]) => price > 0)
    .map(([qty]) => qty);
}

function getDefaultSize(prices: Record<PizzaSize, number>): PizzaSize | undefined {
  return getAvailableSizes(prices)[0];
}

function getDefaultQuantity(prices: Record<QuantityOption, number>): QuantityOption | undefined {
  return getAvailableQuantities(prices)[0];
}

const PIZZA_FLAVORS: PizzaFlavor[] = ['Tikka', 'Fajita', 'Spicy'];
const DRINK_CHOICES: DrinkChoice[] = ['Cola Next', 'Fizzup', 'Water'];

const EXCLUDED_CATEGORIES = new Set(['soft-drink', 'chillers', 'add-ons', 'crispy-chicken', 'new-arrival', 'pizza', 'special-pizza', 'signature-pizza', 'fries', 'crunch-n-munch', 'pasta']);

const CRISPY_CHICKEN_IMAGES: Record<string, string> = {
  '1 pcs': '/images/crispy-chicken/1pcs-chicken.jpeg',
  '3 pcs': '/images/crispy-chicken/3pcs-chicken.jpeg',
  '5 pcs': '/images/crispy-chicken/5pcs-chicken.jpeg',
};

const WRAP_IMAGES: Record<string, string> = {
  'Crispy': '/images/wraps/crispy-wrap.jpeg',
  'Grill': '/images/wraps/grill-wrap.jpeg',
};

function getProductImage(product: Product, selectedQuantity?: QuantityOption): string {
  if (product.categoryId === 'crispy-chicken' && selectedQuantity && CRISPY_CHICKEN_IMAGES[selectedQuantity]) {
    return CRISPY_CHICKEN_IMAGES[selectedQuantity];
  }
  if (product.categoryId === 'wraps' && selectedQuantity && WRAP_IMAGES[selectedQuantity]) {
    return WRAP_IMAGES[selectedQuantity];
  }
  return product.image || '/images/placeholder.jpg';
}

function hasPizzaInDeal(items: string[]): boolean {
  return items.some(item => /pizza/i.test(item));
}

function hasDrinkInDeal(items: string[]): boolean {
  return items.some(item => /drink|300ml|1 ltr|1\.5 ltr/i.test(item));
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();

  // Selection state
  const [selectedSize, setSelectedSize] = useState<PizzaSize | undefined>();
  const [selectedQuantity, setSelectedQuantity] = useState<QuantityOption | undefined>();
  const [selectedSauces, setSelectedSauces] = useState<WrapSauce[]>([]);
  const [selectedPizzaFlavor, setSelectedPizzaFlavor] = useState<PizzaFlavor | undefined>();
  const [selectedDrinkChoice, setSelectedDrinkChoice] = useState<DrinkChoice | undefined>();
  const [extraCheese, setExtraCheese] = useState(false);
  const [cheeseSlice, setCheeseSlice] = useState(false);

  // Track the product id we last initialized for
  const [initProductId, setInitProductId] = useState<string | null>(null);

  // Closing animation state
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Reset selections when product changes
  if (product && product.id !== initProductId) {
    setInitProductId(product.id);
    setSelectedSize(product.type === 'size' ? getDefaultSize(product.prices) : undefined);
    setSelectedQuantity(product.type === 'quantity' ? getDefaultQuantity(product.prices) : undefined);
    setSelectedSauces([]);
    setSelectedPizzaFlavor(undefined);
    setSelectedDrinkChoice(undefined);
    setExtraCheese(false);
    setCheeseSlice(false);
  }

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Compute current price based on selections
  const currentPrice = useMemo(() => {
    if (!product) return 0;

    let base = 0;

    if (product.type === 'simple' || product.type === 'deal') {
      base = product.price;
    } else if (product.type === 'size' && selectedSize) {
      base = product.prices[selectedSize];
    } else if (product.type === 'quantity' && selectedQuantity) {
      base = product.prices[selectedQuantity];
    }

    // Add-ons: extra cheese (size-variant products only)
    if (extraCheese && product.type === 'size' && selectedSize) {
      const toppingPrices: Record<PizzaSize, number> = { Small: 150, Medium: 250, Large: 300 };
      base += toppingPrices[selectedSize];
    }

    // Add-ons: cheese slice (all eligible products)
    if (cheeseSlice) {
      base += 100;
    }

    // Deal add-ons: pizza flavor (free choice, no extra cost)
    // Deal add-ons: drink choice (free choice, no extra cost)

    return base;
  }, [product, selectedSize, selectedQuantity, extraCheese, cheeseSlice]);

  const isSizeVariant = product?.type === 'size';
  const isQuantityVariant = product?.type === 'quantity';
  const isDeal = product?.type === 'deal';
  const isWrap = product?.categoryId === 'wraps';
  const isPizza = product?.categoryId === 'pizza' || product?.categoryId === 'special-pizza' || product?.categoryId === 'signature-pizza';
  const showCheeseSlice = product != null && !EXCLUDED_CATEGORIES.has(product.categoryId);
  const dealHasPizza = isDeal && product.type === 'deal' && hasPizzaInDeal(product.items);
  const dealHasDrink = isDeal && product.type === 'deal' && hasDrinkInDeal(product.items);

  const canAddToCart = useMemo(() => {
    if (!product) return false;
    if (isSizeVariant && !selectedSize) return false;
    if (isQuantityVariant && !selectedQuantity) return false;
    if (isWrap && selectedSauces.length !== 2) return false;
    if (dealHasPizza && !selectedPizzaFlavor) return false;
    if (dealHasDrink && !selectedDrinkChoice) return false;
    return currentPrice > 0;
  }, [product, isSizeVariant, isQuantityVariant, selectedSize, selectedQuantity, isWrap, selectedSauces, dealHasPizza, selectedPizzaFlavor, dealHasDrink, selectedDrinkChoice, currentPrice]);

  const handleSauceToggle = useCallback((sauce: WrapSauce) => {
    setSelectedSauces((prev) => {
      if (prev.includes(sauce)) {
        return prev.filter((s) => s !== sauce);
      }
      if (prev.length >= 2) return prev;
      return [...prev, sauce];
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product || !canAddToCart) return;

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity: 1,
      selectedSize: isSizeVariant ? selectedSize : undefined,
      selectedQuantity: isQuantityVariant ? selectedQuantity : undefined,
      selectedSauces: isWrap ? selectedSauces : undefined,
      pizzaFlavor: dealHasPizza ? selectedPizzaFlavor : undefined,
      drinkChoice: dealHasDrink ? selectedDrinkChoice : undefined,
      extraCheese,
      cheeseSlice,
      totalPrice: currentPrice,
    };

    addItem(cartItem);
    handleClose();
  }, [
    product,
    canAddToCart,
    isSizeVariant,
    selectedSize,
    isQuantityVariant,
    selectedQuantity,
    isWrap,
    selectedSauces,
    dealHasPizza,
    selectedPizzaFlavor,
    dealHasDrink,
    selectedDrinkChoice,
    extraCheese,
    cheeseSlice,
    currentPrice,
    addItem,
    handleClose,
  ]);

  if (!product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <div
          className={`relative w-full max-w-lg max-h-[85vh] bg-background rounded-2xl shadow-2xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen && !isClosing ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-6'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 overscroll-contain">
            {/* Product Image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-gray-100">
              <Image
                src={getProductImage(product, selectedQuantity)}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Deal Items List */}
            {isDeal && product.type === 'deal' && (
              <div className="px-5 pb-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Includes
                </p>
                <ul className="space-y-1">
                  {product.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size Selection (Pizzas) */}
            {isSizeVariant && (
              <div className="px-5 pb-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Size
                </p>
                <div className="flex gap-2">
                  {getAvailableSizes(product.prices).map((size) => {
                    const price = product.prices[size];
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex-1 flex flex-col items-center gap-0.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-accent bg-accent/5 text-foreground'
                            : 'border-border hover:border-accent/40 text-foreground/70'
                        }`}
                      >
                        <span className="text-sm font-semibold">{SIZE_LABELS[size]}</span>
                        <span className="text-xs text-muted">Rs {price.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selection (Wings, Nuggets, Chicken) */}
            {isQuantityVariant && (
              <div className="px-5 pb-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Select Option
                </p>
                <div className="flex gap-2">
                  {getAvailableQuantities(product.prices).map((qty) => {
                    const price = product.prices[qty];
                    const isSelected = selectedQuantity === qty;
                    return (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setSelectedQuantity(qty)}
                        className={`flex-1 flex flex-col items-center gap-0.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-accent bg-accent/5 text-foreground'
                            : 'border-border hover:border-accent/40 text-foreground/70'
                        }`}
                      >
                        <span className="text-sm font-semibold">{qty}</span>
                        <span className="text-xs text-muted">Rs {price.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Wrap Sauce Selection */}
            {isWrap && (
              <div className="px-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Choose Exactly 2 Sauces
                  </p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    selectedSauces.length === 2
                      ? 'bg-green-100 text-green-700'
                      : 'bg-accent/10 text-accent'
                  }`}>
                    {selectedSauces.length} / 2
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SAUCES.map((sauce) => {
                    const isSelected = selectedSauces.includes(sauce);
                    return (
                      <button
                        key={sauce}
                        type="button"
                        onClick={() => handleSauceToggle(sauce)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-accent bg-accent/5 text-foreground'
                            : 'border-border hover:border-accent/40 text-foreground/70'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-accent bg-accent' : 'border-border'
                        }`}>
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm">{sauce}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Deal: Pizza Flavor Selector */}
            {dealHasPizza && (
              <div className="px-5 pb-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Choose Pizza Flavour
                </p>
                <div className="flex gap-2">
                  {PIZZA_FLAVORS.map((flavor) => {
                    const isSelected = selectedPizzaFlavor === flavor;
                    return (
                      <button
                        key={flavor}
                        type="button"
                        onClick={() => setSelectedPizzaFlavor(flavor)}
                        className={`flex-1 flex flex-col items-center gap-0.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-accent bg-accent/5 text-foreground'
                            : 'border-border hover:border-accent/40 text-foreground/70'
                        }`}
                      >
                        <span className="text-sm font-semibold">{flavor}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Deal: Drink Selector */}
            {dealHasDrink && (
              <div className="px-5 pb-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Choose Drink
                </p>
                <div className="flex gap-2">
                  {DRINK_CHOICES.map((drink) => {
                    const isSelected = selectedDrinkChoice === drink;
                    return (
                      <button
                        key={drink}
                        type="button"
                        onClick={() => setSelectedDrinkChoice(drink)}
                        className={`flex-1 flex flex-col items-center gap-0.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-accent bg-accent/5 text-foreground'
                            : 'border-border hover:border-accent/40 text-foreground/70'
                        }`}
                      >
                        <span className="text-sm font-semibold">{drink}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons: Extra Cheese (size-variant products) */}
            {isPizza && isSizeVariant && (
              <div className="px-5 pb-3 space-y-2">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Add-ons
                </p>
                <button
                  type="button"
                  onClick={() => setExtraCheese(!extraCheese)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    extraCheese
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/40'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      extraCheese ? 'border-accent bg-accent' : 'border-border'
                    }`}>
                      {extraCheese && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium">Extra Cheese / Topping</span>
                  </span>
                  <span className="text-sm text-muted">
                    + Rs {selectedSize === 'Small' ? 150 : selectedSize === 'Medium' ? 250 : 300}
                  </span>
                </button>
              </div>
            )}

            {/* Cheese Slice (all eligible products except chillers, drinks, add-ons, extra topping) */}
            {showCheeseSlice && (
              <div className="px-5 pb-3">
                {!isPizza && (
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Add-ons
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setCheeseSlice(!cheeseSlice)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    cheeseSlice
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/40'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      cheeseSlice ? 'border-accent bg-accent' : 'border-border'
                    }`}>
                      {cheeseSlice && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium">Cheese Slice</span>
                  </span>
                  <span className="text-sm text-muted">+ Rs 100</span>
                </button>
              </div>
            )}
          </div>

          {/* Sticky Footer: Price + Add to Cart */}
          <div className="border-t border-border bg-background px-5 py-4 flex items-center justify-between gap-4 shrink-0">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-medium">Total</p>
              <p className="text-xl font-bold text-accent">
                Rs {currentPrice.toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`px-6 py-3 rounded-xl font-semibold text-sm tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                canAddToCart
                  ? 'bg-accent text-white hover:bg-accent-hover active:scale-[0.97]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
