export function formatPrice(price: number): string {
  return `Rs ${price.toLocaleString()}`;
}

export function generateOrderId(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `BF-${random}`;
}
