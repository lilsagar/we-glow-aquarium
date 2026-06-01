export type PaymentMethod = "cod" | "esewa" | "khalti";

export type OrderStatus =
  | "pending"
  | "paid"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

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
