import { NextResponse } from "next/server";

type SignatureRequest = {
  total_amount?: string;
  transaction_uuid?: string;
  product_code?: string;
};

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY ?? "";

export async function POST(request: Request) {
  const body = (await request.json()) as SignatureRequest;
  const { total_amount, transaction_uuid, product_code } = body;

  if (!total_amount || !transaction_uuid || !product_code) {
    return NextResponse.json(
      { error: "Missing required eSewa signature fields." },
      { status: 400 },
    );
  }

  if (!ESEWA_SECRET_KEY) {
    return NextResponse.json(
      { error: "ESEWA_SECRET_KEY is not configured." },
      { status: 500 },
    );
  }

  const payload = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const encoder = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(ESEWA_SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    encoder.encode(payload),
  );

  const signature = Buffer.from(signatureBuffer).toString("base64");

  return NextResponse.json({ signature });
}
