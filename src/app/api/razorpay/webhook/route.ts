import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret.includes('your_webhook')) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not set. Skipping webhook signature verification.');
      return NextResponse.json({ received: true, note: 'Webhook secret unconfigured' });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    // Verify webhook signature with SHA256 HMAC
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      console.error('Razorpay webhook signature verification failed.');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // Handle payment capture or order fulfillment events
    if (eventType === 'order.paid' || eventType === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const adminClient = createAdminSupabaseClient();

        // 1. Look up existing order in our database
        const { data: order } = await adminClient
          .from('orders')
          .select('*')
          .eq('razorpay_order_id', orderId)
          .single();

        if (order && order.status !== 'fulfilled' && order.user_id) {
          // 2. Fulfill order
          await adminClient
            .from('orders')
            .update({
              status: 'fulfilled',
              razorpay_payment_id: paymentId || order.razorpay_payment_id,
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', orderId);

          // 3. Upgrade user to PRO via service role
          await adminClient
            .from('profiles')
            .update({
              is_pro: true,
              pro_plan_name: 'Voyage Pro Explorer Pass',
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.user_id);

          console.log(`[Razorpay Webhook] Successfully fulfilled order ${orderId} for user ${order.user_id}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
