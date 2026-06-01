"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatNpr } from "@/lib/format-npr";
import {
  generateOrderId,
  PAYMENT_METHODS,
  saveOrderToFirestore,
  type Order,
  type PaymentMethod,
} from "@/lib/orders";

const ESEWA_ENDPOINT = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_SIGNATURE_API = "/api/esewa/signature";
const ESEWA_PRODUCT_CODE = "EPAYTEST";
const ESEWA_SUCCESS_URL = "http://localhost:3000/payment/esewa/success";
const ESEWA_FAILURE_URL = "http://localhost:3000/payment/esewa/failure";
const ESEWA_SIGNED_FIELDS = "total_amount,transaction_uuid,product_code";
import { useCart } from "@/components/providers/cart-provider";
import type { CartLine } from "@/components/providers/cart-provider";

type FormState = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethod;
};

const initial: FormState = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  paymentMethod: "cod",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-black shadow-sm transition-colors focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10";

function buildOrder(lines: CartLine[], form: FormState): Order {
  const subtotalNpr = lines.reduce(
    (sum, l) => sum + l.product.priceNpr * l.quantity,
    0,
  );

  return {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "pending",
    customer: {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
    },
    paymentMethod: form.paymentMethod,
    items: lines.map((l) => ({
      slug: l.product.slug,
      name: l.product.name,
      priceNpr: l.product.priceNpr,
      quantity: l.quantity,
      imageUrl: l.product.imageUrl,
    })),
    subtotalNpr,
  };
}

async function getEsewaSignature(
  totalAmount: string,
  transactionUuid: string,
): Promise<string> {
  const response = await fetch(ESEWA_SIGNATURE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Unable to generate eSewa signature: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const json = await response.json();
  if (!json.signature) {
    throw new Error("eSewa signature response did not include a signature.");
  }

  return json.signature;
}

async function postToEsewa(order: Order) {
  const totalAmount = order.subtotalNpr.toFixed(2);
  const transactionUuid = order.id;
  const signature = await getEsewaSignature(totalAmount, transactionUuid);

  const fields = {
    amount: totalAmount,
    tax_amount: "0.00",
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_PRODUCT_CODE,
    product_service_charge: "0.00",
    product_delivery_charge: "0.00",
    success_url: ESEWA_SUCCESS_URL,
    failure_url: ESEWA_FAILURE_URL,
    signed_field_names: ESEWA_SIGNED_FIELDS,
    signature,
  } as Record<string, string>;

  console.log("eSewa v2 POST redirect", {
    endpoint: ESEWA_ENDPOINT,
    orderId: order.id,
    totalAmount,
    transactionUuid,
    successUrl: ESEWA_SUCCESS_URL,
    failureUrl: ESEWA_FAILURE_URL,
    signedFieldNames: ESEWA_SIGNED_FIELDS,
  });

  const form = document.createElement("form");
  form.method = "POST";
  form.action = ESEWA_ENDPOINT;
  form.style.display = "none";

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotalNpr, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      lines.length > 0 &&
      form.fullName.trim().length >= 2 &&
      form.phone.trim().length >= 7 &&
      form.address.trim().length >= 10 &&
      form.city.trim().length >= 2 &&
      PAYMENT_METHODS.some((m) => m.id === form.paymentMethod)
    );
  }, [lines.length, form]);

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-black">Your cart is empty</p>
        <p className="mt-2 text-sm text-neutral-600">Add items before checking out.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-8 lg:grid-cols-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!canSubmit || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
          const order = buildOrder(lines, form);
          console.log("Saving checkout order", order);
          await saveOrderToFirestore(order);
          if (form.paymentMethod === "esewa") {
            console.log("Order saved, redirecting to eSewa sandbox", order.id);
            await postToEsewa(order);
            clearCart();
            return;
          }
          clearCart();
          router.push(`/order/success?orderId=${encodeURIComponent(order.id)}`);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Could not place your order. Please try again.",
          );
          setSubmitting(false);
        }
      }}
    >
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-black">Delivery details</h2>
          <p className="mt-1 text-sm text-neutral-600">
            We will use this information to deliver your aquarium supplies.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                htmlFor="fullName"
              >
                Full name
              </label>
              <input
                id="fullName"
                autoComplete="name"
                className={inputClass}
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
                minLength={2}
                placeholder="e.g. Sita Sharma"
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                htmlFor="phone"
              >
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                minLength={7}
                placeholder="e.g. 98XXXXXXXX"
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                htmlFor="city"
              >
                City
              </label>
              <input
                id="city"
                autoComplete="address-level2"
                className={inputClass}
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                required
                minLength={2}
                placeholder="e.g. Kathmandu"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                htmlFor="address"
              >
                Delivery address
              </label>
              <textarea
                id="address"
                autoComplete="street-address"
                className={`${inputClass} min-h-[120px]`}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
                minLength={10}
                placeholder="Street, area, landmark"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-black">Payment method</h2>
          <p className="mt-1 text-sm text-neutral-600">Choose how you would like to pay.</p>

          <fieldset className="mt-5 space-y-3">
            <legend className="sr-only">Payment method</legend>
            {PAYMENT_METHODS.map((method) => {
              const selected = form.paymentMethod === method.id;
              return (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
                    selected
                      ? "border-black bg-neutral-50 ring-2 ring-black/10"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selected}
                    onChange={() =>
                      setForm((f) => ({ ...f, paymentMethod: method.id }))
                    }
                    className="mt-1 size-4 accent-black"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-black">
                      {method.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {method.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-black">Order summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm">
            {lines.map((l) => (
              <li key={l.product.slug} className="flex justify-between gap-3">
                <span className="text-neutral-700">
                  {l.product.name}{" "}
                  <span className="text-neutral-400">×{l.quantity}</span>
                </span>
                <span className="shrink-0 font-semibold text-black">
                  {formatNpr(l.product.priceNpr * l.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-black">Subtotal</span>
              <span className="text-lg font-bold text-black">{formatNpr(subtotalNpr)}</span>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Orders are saved locally in your browser for this demo.
            </p>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="mt-6 w-full rounded-full bg-black px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
          <Link
            href="/cart"
            className="mt-4 block text-center text-sm font-medium text-black underline-offset-4 hover:underline"
          >
            Back to cart
          </Link>
        </div>
      </aside>
    </form>
  );
}
