import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Convert string prices to cents
    const price_adult_cents = Math.round(parseFloat(body.priceAdult) * 100);
    const price_kid_cents = Math.round(parseFloat(body.priceKid) * 100);

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .insert({
        title: body.title,
        title_ar: body.titleAr,
        description: body.description,
        event_date: new Date(body.eventDate).toISOString(),
        location: body.location,
        price_adult_cents,
        price_kid_cents,
        max_capacity: parseInt(body.capacity),
        etransfer_email: body.etransferEmail,
        is_active: body.isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
