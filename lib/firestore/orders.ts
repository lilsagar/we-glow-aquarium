import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import type { Order, OrderStatus } from "@/lib/types/order";

const COLLECTION = "orders";

function ordersRef() {
  return collection(getFirestoreDb(), COLLECTION);
}

function orderDoc(id: string) {
  return doc(getFirestoreDb(), COLLECTION, id);
}

function normalizeOrder(data: Record<string, unknown>, id: string): Order {
  const customer = (data.customer ?? {}) as Order["customer"];
  return {
    id,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    status: (data.status as OrderStatus) ?? "pending",
    customer: {
      fullName: String(customer.fullName ?? ""),
      phone: String(customer.phone ?? ""),
      address: String(customer.address ?? ""),
      city: String(customer.city ?? ""),
    },
    paymentMethod: data.paymentMethod as Order["paymentMethod"],
    items: Array.isArray(data.items) ? (data.items as Order["items"]) : [],
    subtotalNpr: Number(data.subtotalNpr ?? 0),
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const q = query(ordersRef(), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeOrder(d.data(), d.id));
}

export function subscribeToOrders(
  onData: (orders: Order[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(ordersRef(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => normalizeOrder(d.data(), d.id)));
    },
    (err) => onError?.(err),
  );
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(orderDoc(id));
  if (!snap.exists()) return null;
  return normalizeOrder(snap.data(), snap.id);
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  await setDoc(orderDoc(order.id), {
    createdAt: order.createdAt,
    status: order.status,
    customer: order.customer,
    paymentMethod: order.paymentMethod,
    items: order.items,
    subtotalNpr: order.subtotalNpr,
  });
}

export async function updateOrderStatusInFirestore(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  const ref = orderDoc(id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  await updateDoc(ref, { status });
  return normalizeOrder({ ...snap.data(), status }, id);
}
