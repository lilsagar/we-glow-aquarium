import type { Order } from "@/lib/types/order";
import { getAdminFirestore } from "@/lib/firebase/admin";

const ORDERS_COLLECTION = "orders";

export type EsewaVerificationResult = {
  updated: boolean;
  message: string;
  order: Order | null;
};

export async function verifyEsewaPayment(
  orderId: string,
  amountParam?: string,
): Promise<EsewaVerificationResult> {
  if (!orderId) {
    return {
      updated: false,
      message: "Missing order ID.",
      order: null,
    };
  }

  const db = getAdminFirestore();
  const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) {
    return {
      updated: false,
      message: "Order not found.",
      order: null,
    };
  }

  const data = orderSnap.data() as Record<string, unknown>;
  const customerData = (data.customer ?? {}) as Record<string, unknown>;
  const items = Array.isArray(data.items) ? (data.items as Order["items"]) : [];

  const order: Order = {
    id: orderSnap.id,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    status: String(data.status ?? "pending") as Order["status"],
    customer: {
      fullName: String(customerData.fullName ?? ""),
      phone: String(customerData.phone ?? ""),
      address: String(customerData.address ?? ""),
      city: String(customerData.city ?? ""),
    },
    paymentMethod: String(data.paymentMethod ?? "cod") as Order["paymentMethod"],
    items,
    subtotalNpr: Number(data.subtotalNpr ?? 0),
  };

  if (order.paymentMethod !== "esewa") {
    return {
      updated: false,
      message: "Order is not an eSewa order.",
      order,
    };
  }

  if (order.status !== "pending") {
    return {
      updated: false,
      message: `Order status is already ${order.status}.`,
      order,
    };
  }

  if (!amountParam) {
    return {
      updated: false,
      message: "Missing amount from eSewa response.",
      order,
    };
  }

  const paidAmount = Number(amountParam);
  const expectedAmount = Number(order.subtotalNpr);
  if (Number.isNaN(paidAmount) || Math.abs(paidAmount - expectedAmount) > 0.005) {
    return {
      updated: false,
      message: "Payment amount does not match the order total.",
      order,
    };
  }

  await orderRef.update({ status: "paid" });

  return {
    updated: true,
    message: "Order status updated to paid.",
    order: { ...order, status: "paid" },
  };
}
