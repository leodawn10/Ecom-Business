import 'server-only';

/**
 * Minimal Razorpay REST helper (no SDK dependency). Server-only — the key
 * secret is never bundled to the client. The publishable key id is exposed
 * to the browser separately for the Checkout widget.
 */

const KEY_ID =
  process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? '';

export const PUBLIC_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? '';

export function isRazorpayConfigured(): boolean {
  return Boolean(KEY_ID && KEY_SECRET);
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

/** Creates a Razorpay order (amount in paise) via the Orders API. */
export async function createRazorpayOrderApi(params: {
  amountMinor: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amountMinor,
      currency: 'INR',
      receipt: params.receipt,
      notes: params.notes ?? {},
      payment_capture: 1,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${body}`);
  }
  return (await res.json()) as RazorpayOrder;
}
