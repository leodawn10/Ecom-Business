'use server';

import { createClient } from '@/lib/supabase/server';
import {
  createRazorpayOrderApi,
  isRazorpayConfigured,
  PUBLIC_KEY_ID,
} from '@/lib/razorpay';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* ════════════════════════ Newsletter ════════════════════════ */

export interface NewsletterState {
  ok: boolean;
  message: string;
}

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }
  const supabase = createClient();
  const { error } = await supabase.from('subscribers').insert({ email });
  if (error) {
    if (error.code === '23505') {
      return { ok: true, message: 'You are already on the heritage list.' };
    }
    return { ok: false, message: 'Something went wrong. Please try again.' };
  }
  return { ok: true, message: 'Welcome to the heritage list.' };
}

/* ════════════════════════ Razorpay checkout ════════════════════════ */

export interface CheckoutInput {
  customer: { name: string; phone: string; email: string };
  items: { slug: string; qty: number }[];
}

export type CreateOrderResult =
  | {
      ok: true;
      keyId: string;
      orderId: string;
      razorpayOrderId: string;
      amount: number;
      currency: string;
      prefill: { name: string; email: string; contact: string };
    }
  | { ok: false; message: string };

/**
 * 1) Persist the order (server computes the authoritative total).
 * 2) Create a matching Razorpay order for that exact amount.
 * 3) Link the two, and hand the browser what Checkout needs.
 */
export async function createRazorpayOrder(
  input: CheckoutInput,
): Promise<CreateOrderResult> {
  const name = input.customer.name?.trim();
  const phone = input.customer.phone?.trim();
  const email = input.customer.email?.trim() ?? '';

  if (!name || !phone) {
    return { ok: false, message: 'Name and phone number are required.' };
  }
  if (!input.items?.length) {
    return { ok: false, message: 'Your cart is empty.' };
  }
  if (!isRazorpayConfigured()) {
    return {
      ok: false,
      message:
        'Online payment is not configured yet. Please call us to place your order.',
    };
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc('place_order', {
    p_customer: { name, phone, email },
    p_items: input.items.map((i) => ({ slug: i.slug, qty: i.qty })),
  });
  if (error || !data) {
    return { ok: false, message: error?.message ?? 'Could not create order.' };
  }

  const { order_id, total_minor } = data as {
    order_id: string;
    total_minor: number;
  };
  if (!total_minor || total_minor <= 0) {
    return { ok: false, message: 'Order total is invalid.' };
  }

  try {
    const rzp = await createRazorpayOrderApi({
      amountMinor: total_minor,
      receipt: order_id,
      notes: { order_id, customer: name },
    });
    await supabase.rpc('attach_razorpay_order', {
      p_order_id: order_id,
      p_rzp_order_id: rzp.id,
    });

    return {
      ok: true,
      keyId: PUBLIC_KEY_ID,
      orderId: order_id,
      razorpayOrderId: rzp.id,
      amount: total_minor,
      currency: 'INR',
      prefill: { name, email, contact: phone },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment setup failed.';
    return { ok: false, message };
  }
}

export interface ConfirmPaymentInput {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}

/**
 * Verifies the Razorpay payment signature inside Postgres (HMAC with the secret
 * that never leaves the database) and marks the order paid. Returns ok only on
 * a genuine, signature-valid payment.
 */
export async function confirmRazorpayPayment(
  input: ConfirmPaymentInput,
): Promise<{ ok: boolean }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('verify_and_mark_paid', {
    p_order_id: input.orderId,
    p_rzp_order_id: input.razorpayOrderId,
    p_rzp_payment_id: input.razorpayPaymentId,
    p_signature: input.signature,
  });
  if (error) return { ok: false };
  return { ok: Boolean(data) };
}
