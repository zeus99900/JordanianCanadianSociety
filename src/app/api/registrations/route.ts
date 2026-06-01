import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendTicketEmail } from '@/lib/email';
import type { Event, Registration } from '@/lib/types';

// POST: Create a new registration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      leadName,
      email,
      phone,
      countMen,
      countWomen,
      countKids,
      stripeIntentId,
      paymentMethod,
      amountPaidCents,
    } = body;

    // Validate required fields
    if (!eventId || !leadName || !email) {
      return NextResponse.json(
        { error: 'Event ID, name, and email are required' },
        { status: 400 }
      );
    }

    const totalGuests = (countMen || 0) + (countWomen || 0) + (countKids || 0);
    if (totalGuests === 0) {
      return NextResponse.json(
        { error: 'At least one guest is required' },
        { status: 400 }
      );
    }

    // Determine paid status based on payment method
    const isPaid = paymentMethod === 'stripe' && Boolean(stripeIntentId);

    const { data: registration, error } = await supabaseAdmin
      .from('event_registrations')
      .insert({
        event_id: eventId,
        lead_name: leadName,
        email,
        phone: phone || null,
        count_men: countMen || 0,
        count_women: countWomen || 0,
        count_kids: countKids || 0,
        amount_paid_cents: amountPaidCents || 0,
        payment_method: paymentMethod || 'stripe',
        stripe_intent_id: stripeIntentId || null,
        is_paid: isPaid,
      })
      .select('*, events(*)')
      .single();

    if (error || !registration) {
      console.error('Registration insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Send confirmation email in the background (don't await it so we don't slow down the response)
    if (registration.events) {
      sendTicketEmail(registration as Registration, registration.events as Event).catch(err => {
        console.error('Background email failed:', err);
      });
    }

    return NextResponse.json({ registrationId: registration.id });
  } catch (err: unknown) {
    console.error('Registration error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: Lookup registrations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const eventId = searchParams.get('eventId');

    // Lookup by registration ID
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('event_registrations')
        .select('*, events(*)')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    }

    // Search by name
    if (search && eventId) {
      const { data, error } = await supabaseAdmin
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .ilike('lead_name', `%${search}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        return NextResponse.json(
          { error: 'Search failed' },
          { status: 500 }
        );
      }

      return NextResponse.json(data || []);
    }

    // Get all registrations for an event (admin use)
    if (eventId) {
      const { data, error } = await supabaseAdmin
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch registrations' },
          { status: 500 }
        );
      }

      return NextResponse.json(data || []);
    }

    return NextResponse.json(
      { error: 'Please provide an id, or search + eventId' },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error('Registration lookup error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
