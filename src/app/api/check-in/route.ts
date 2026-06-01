import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { registrationId, forcePaid } = await req.json();

    if (!registrationId) {
      return NextResponse.json(
        { status: 'error', message: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Fetch the registration
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('event_registrations')
      .select('*, events(title)')
      .eq('id', registrationId)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json(
        { status: 'not_found', message: 'Registration not found' },
        { status: 404 }
      );
    }

    // Handle Unpaid Status
    if (!registration.is_paid && !forcePaid) {
      return NextResponse.json({
        status: 'not_paid',
        message: `Unpaid Balance: $${(registration.amount_paid_cents / 100).toFixed(2)} CAD`,
        registration,
      });
    }

    // Check if already checked in
    if (registration.is_checked_in && registration.is_paid) {
      return NextResponse.json({
        status: 'already_checked_in',
        message: `${registration.lead_name} has already been checked in`,
        registration,
      });
    }

    // Mark as checked in (and paid if forcePaid was used)
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('event_registrations')
      .update({
        is_checked_in: true,
        checked_in_at: new Date().toISOString(),
        ...(forcePaid ? { is_paid: true } : {}),
      })
      .eq('id', registrationId)
      .select('*, events(title)')
      .single();

    if (updateError) {
      return NextResponse.json(
        { status: 'error', message: 'Failed to check in' },
        { status: 500 }
      );
    }

    const totalGuests = (updated.count_men || 0) + (updated.count_women || 0) + (updated.count_kids || 0);

    return NextResponse.json({
      status: 'success',
      message: `${updated.lead_name} checked in! (${totalGuests} guest${totalGuests !== 1 ? 's' : ''})`,
      registration: updated,
    });
  } catch (err: unknown) {
    console.error('Check-in error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { status: 'error', message },
      { status: 500 }
    );
  }
}
