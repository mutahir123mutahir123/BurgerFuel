export function formatPrice(price: number): string {
  return `Rs ${price.toLocaleString()}`;
}

export function generateOrderId(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `BF-${random}`;
}

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_CHARGE_AMOUNT = 100;

export function getDeliveryCharge(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE_AMOUNT;
}

export function isFreeDelivery(subtotal: number): boolean {
  return subtotal >= FREE_DELIVERY_THRESHOLD;
}
