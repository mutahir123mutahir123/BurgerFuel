// Product variant types
export type ProductVariantType = 'size' | 'quantity';

// Size options for pizzas
export type PizzaSize = 'Small' | 'Medium' | 'Large';

// Quantity options for wings/nuggets
export type QuantityOption = '5 pcs' | '10 pcs' | '1 pcs' | '3 pcs' | 'Crispy' | 'Grill';

// Wrap sauce options
export type WrapSauce = 
  | 'Chipotle' 
  | 'Honey Mustard' 
  | 'Salsa' 
  | 'B.B.Q' 
  | 'Chilli Lava' 
  | 'Peri Peri' 
  | 'Garlic';

// Pizza flavor options for deals
export type PizzaFlavor = 'Tikka' | 'Fajita' | 'Spicy';

// Drink choice options for deals
export type DrinkChoice = 'Cola Next' | 'Fizzup' | 'Water';

// Base product interface
export interface BaseProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
}

// Simple price product (most items)
export interface SimpleProduct extends BaseProduct {
  type: 'simple';
  price: number;
}

// Size variant product (pizzas)
export interface SizeVariantProduct extends BaseProduct {
  type: 'size';
  prices: Record<PizzaSize, number>;
}

// Quantity variant product (wings, nuggets, etc.)
export interface QuantityVariantProduct extends BaseProduct {
  type: 'quantity';
  prices: Record<QuantityOption, number>;
}

// Deal product (fixed price combos)
export interface DealProduct extends BaseProduct {
  type: 'deal';
  price: number;
  items: string[];
}

// Union type for all products
export type Product = SimpleProduct | SizeVariantProduct | QuantityVariantProduct | DealProduct;

// Product configuration options
export interface ProductConfig {
  allowSizeSelection: boolean;
  allowQuantitySelection: boolean;
  allowExtraCheese: boolean;
  allowCheeseSlice: boolean;
  allowWrapSauces: boolean;
  requiredWrapSauces?: number;
}

// Cart item with configuration
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: PizzaSize;
  selectedQuantity?: QuantityOption;
  selectedSauces?: WrapSauce[];
  pizzaFlavor?: PizzaFlavor;
  drinkChoice?: DrinkChoice;
  extraCheese?: boolean;
  cheeseSlice?: boolean;
  totalPrice: number;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  products: Product[];
}

// Hero banner interface
export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
}

// Menu data structure
export interface MenuData {
  categories: Category[];
  heroBanners: HeroBanner[];
}

// Cart state interface
export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// Checkout form data
export interface CheckoutFormData {
  orderType: 'pickup' | 'delivery';
  name: string;
  phone: string;
  address?: string;
  kitchenNotes?: string;
  paymentMethod: 'cash_on_delivery';
}

// Order interface
export interface Order {
  id: string;
  items: CartItem[];
  formData: CheckoutFormData;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
}
