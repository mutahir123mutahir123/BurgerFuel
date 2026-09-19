import { Order } from '@/types';

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

const WHATSAPP_PHONE = '923194756008';

export function buildWhatsAppUrl(order: Order): string {
  const lines: string[] = [];

  lines.push(`*Order ID:* #${order.id}`);
  lines.push('');

  lines.push('*Items:*');
  order.items.forEach((item) => {
    const options: string[] = [];
    if (item.selectedSize) options.push(item.selectedSize);
    if (item.pizzaFlavor) options.push(item.pizzaFlavor);
    if (item.drinkChoice) options.push(item.drinkChoice);
    if (item.selectedSauces?.length) options.push(item.selectedSauces.join(', '));
    if (item.extraCheese) options.push('Extra Cheese');
    if (item.cheeseSlice) options.push('Cheese Slice');

    const opts = options.length ? ` (${options.join(', ')})` : '';
    lines.push(`- ${item.product.name} x${item.quantity}${opts}`);
  });

  lines.push('');
  lines.push(`*Name:* ${order.formData.name}`);
  lines.push(`*Phone:* ${order.formData.phone}`);
  lines.push(`*Type:* ${order.formData.orderType === 'delivery' ? 'Delivery' : 'Pickup'}`);

  if (order.formData.address) {
    lines.push(`*Address:* ${order.formData.address}`);
  }

  if (order.formData.kitchenNotes) {
    lines.push(`*Notes:* ${order.formData.kitchenNotes}`);
  }

  lines.push('');
  lines.push(`*Total:* ${formatPrice(order.total)}`);

  const message = lines.join('\n');
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}
