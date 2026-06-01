import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment Intent ID is required' }, { status: 400 });
    }

    // Verify the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    }

    const userId = paymentIntent.metadata.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID missing in payment metadata' }, { status: 400 });
    }

    // Calculate expiration date (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Upsert membership
    const { error } = await supabaseAdmin
      .from('memberships')
      .upsert({
        user_id: userId,
        status: 'active',
        expires_at: expiresAt.toISOString(),
        stripe_payment_id: paymentIntentId,
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Failed to create membership:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, expiresAt });
  } catch (error: any) {
    console.error('Membership confirmation error:', error);
    return NextResponse.json(
      { error: error.message || 'Confirmation failed' },
      { status: 500 }
    );
  }
}
