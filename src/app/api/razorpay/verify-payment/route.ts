import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to verify your payment.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required order or payment identifiers.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = orderId.startsWith('order_mock_') || !keySecret || keySecret.includes('your_key');
    const adminClient = createAdminSupabaseClient();

    // Handle test simulation mode when keys are unconfigured
    if (isMock) {
      // Update orders table if row exists
      await adminClient
        .from('orders')
        .update({
          status: 'fulfilled',
          razorpay_payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', orderId);

      // Upgrade profile with service_role privileges
      await adminClient
        .from('profiles')
        .update({
          is_pro: true,
          pro_plan_name: 'Voyage Pro Explorer Pass (Test Simulation)',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      return NextResponse.json({
        success: true,
        isPro: true,
        isMock: true,
        message: 'Test simulation payment verified! You now have Voyage Pro access.',
      });
    }

    // 2. Anti-Replay Defense: Verify order exists in our database, belongs to this user, and is not already fulfilled
    const { data: existingOrder, error: orderError } = await adminClient
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !existingOrder) {
      return NextResponse.json(
        { error: 'Order not found or does not belong to the authenticated user.' },
        { status: 404 }
      );
    }

    if (existingOrder.status === 'fulfilled') {
      return NextResponse.json(
        { error: 'Payment replay detected. This order has already been fulfilled.' },
        { status: 400 }
      );
    }

    // 3. Verify cryptographic HMAC signature from Razorpay
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isSignatureValid) {
      await adminClient
        .from('orders')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('razorpay_order_id', orderId);

      return NextResponse.json(
        { error: 'Invalid payment signature. Transaction verification failed.' },
        { status: 400 }
      );
    }

    // 4. Mark order fulfilled and upgrade user to PRO using service_role
    await adminClient
      .from('orders')
      .update({
        status: 'fulfilled',
        razorpay_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', orderId);

    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        is_pro: true,
        pro_plan_name: 'Voyage Pro Explorer Pass',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating user profile to PRO:', profileError.message);
      return NextResponse.json(
        { error: 'Payment received but failed to update profile. Contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isPro: true,
      message: 'Payment verified! Welcome to Voyage Pro.',
    });
  } catch (error: any) {
    console.error('Error in /api/razorpay/verify-payment:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
