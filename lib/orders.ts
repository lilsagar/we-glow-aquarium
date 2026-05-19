export type PaymentMethod = "cod" | "esewa" | "khalti";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
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

export type OrderItem = {
  slug: string;
  name: string;
  priceNpr: number;
  quantity: number;
  imageUrl: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotalNpr: number;
};

const ORDERS_STORAGE_KEY = "we-glow-aquarium-orders-v1";

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isOrder).map(normalizeOrder);
  } catch {
    return [];
  }
}

function normalizeOrder(o: Order): Order {
  return {
    ...o,
    status: o.status ?? "pending",
  };
}

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const o = value as Order;
  return (
    typeof o.id === "string" &&
    typeof o.createdAt === "string" &&
    typeof o.subtotalNpr === "number" &&
    Array.isArray(o.items) &&
    o.customer !== null &&
    typeof o.customer === "object" &&
    typeof (o.customer as Order["customer"]).fullName === "string"
  );
}

function writeOrders(orders: Order[]): void {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function getAllOrders(): Order[] {
  return readOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function saveOrder(order: Order): void {
  const existing = readOrders();
  const next = [normalizeOrder(order), ...existing].slice(0, 100);
  writeOrders(next);
}

export function getOrderById(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  const updated = { ...orders[idx], status };
  const next = [...orders];
  next[idx] = updated;
  writeOrders(next);
  return updated;
}

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
