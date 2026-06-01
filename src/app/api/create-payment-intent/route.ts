import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { eventId, countMen, countWomen, countKids } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const totalGuests = (countMen || 0) + (countWomen || 0) + (countKids || 0);
    if (totalGuests === 0) {
      return NextResponse.json({ error: 'At least one guest is required' }, { status: 400 });
    }

    // Fetch event pricing
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('price_adult_cents, price_kid_cents, title')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

// Calculate total based on flat rate (using adult price as the base registration fee)
let amount = event.price_adult_cents;
const adultCount = (countMen || 0) + (countWomen || 0);
const kidCount = countKids || 0;

// Check for active membership
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (membership) {
    // $5.00 flat discount
    amount = Math.max(0, amount - 500);
  }
}

    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
      metadata: {
        eventId,
        eventTitle: event.title,
        adults: adultCount.toString(),
        kids: kidCount.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (err: unknown) {
    console.error('PaymentIntent error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
