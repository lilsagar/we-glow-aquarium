import type { OrderStatus, PaymentMethod } from "@/lib/types/order";

export type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "@/lib/types/order";

export const ORDER_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
  { id: "confirmed", label: "Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
  {
    id: "esewa",
    label: "eSewa",
    description: "Pay via eSewa wallet (demo)",
  },
  {
    id: "khalti",
    label: "Khalti",
    description: "Pay via Khalti wallet (demo)",
  },
];

export {
  fetchOrders,
  subscribeToOrders,
  fetchOrderById,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
} from "@/lib/firestore/orders";

export function getPaymentLabel(method: PaymentMethod): string {
  return PAYMENT_METHODS.find((m) => m.id === method)?.label ?? method;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUSES.find((s) => s.id === status)?.label ?? status;
}

export function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WG-${stamp}-${rand}`;
}
