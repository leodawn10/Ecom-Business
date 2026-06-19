import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Razorpay webhook — a reliability backstop so an order still gets marked paid
 * if the customer closes the tab before the in-page handler runs.
 *
 * Set RAZORPAY_WEBHOOK_SECRET (env) AND store the same value in Supabase as
 * app_secrets('razorpay_webhook_secret'). Configure the webhook in the Razorpay
 * dashboard for the `payment.captured` and `order.paid` events.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');

  // timing-safe comparison
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false, reason: 'bad_signature' }, { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_json' }, { status: 400 });
  }

  const entity =
    payload?.payload?.payment?.entity ?? payload?.payload?.order?.entity ?? null;
  const rzpOrderId: string | undefined = entity?.order_id ?? entity?.id;
  const rzpPaymentId: string | undefined = entity?.id;

  if (rzpOrderId) {
    const supabase = createClient();
    await supabase.rpc('mark_paid_via_webhook', {
      p_rzp_order_id: rzpOrderId,
      p_rzp_payment_id: rzpPaymentId ?? '',
      p_secret: secret,
    });
  }

  // Always 200 so Razorpay does not retry indefinitely on handled events.
  return NextResponse.json({ ok: true });
}
