import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate requesting user
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to upgrade to Voyage Pro.' },
        { status: 401 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const isRazorpayConfigured = Boolean(
      keyId &&
      keySecret &&
      !keyId.includes('your_key') &&
      !keySecret.includes('your_key')
    );

    const PRO_PLAN_PRICE_INR = 299;
    const PRO_PLAN_AMOUNT_PAISE = PRO_PLAN_PRICE_INR * 100; // 29900 paise

    // If Razorpay keys are present, create genuine order with Razorpay API
    if (isRazorpayConfigured && keyId && keySecret) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const orderOptions = {
        amount: PRO_PLAN_AMOUNT_PAISE,
        currency: 'INR',
        receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          userId: user.id,
          plan: 'voyage_pro_pass',
          userEmail: user.email || '',
        },
      };

      const rzpOrder = await razorpay.orders.create(orderOptions);

      // Register order in public.orders ledger table (Replay attack defense)
      const adminClient = createAdminSupabaseClient();
      await adminClient.from('orders').insert({
        user_id: user.id,
        razorpay_order_id: rzpOrder.id,
        amount: PRO_PLAN_PRICE_INR,
        currency: 'INR',
        status: 'created',
        plan_code: 'voyage_pro_pass',
        metadata: {
          receipt: rzpOrder.receipt,
          notes: rzpOrder.notes,
        },
      });

      return NextResponse.json({
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: keyId,
        isMock: false,
      });
    }

    // Fallback: Local simulation mode for development/testing when keys are not yet provided
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const adminClient = createAdminSupabaseClient();
    try {
      await adminClient.from('orders').insert({
        user_id: user.id,
        razorpay_order_id: mockOrderId,
        amount: PRO_PLAN_PRICE_INR,
        currency: 'INR',
        status: 'created',
        plan_code: 'voyage_pro_pass',
        metadata: { isSimulation: true },
      });
    } catch {}

    return NextResponse.json({
      orderId: mockOrderId,
      amount: PRO_PLAN_AMOUNT_PAISE,
      currency: 'INR',
      keyId: 'rzp_test_simulation',
      isMock: true,
      message: 'Razorpay keys not configured in .env.local — running in test simulation mode.',
    });
  } catch (error: any) {
    console.error('Error in /api/razorpay/create-order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment order.' },
      { status: 500 }
    );
  }
}
