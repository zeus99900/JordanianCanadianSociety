import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data: registrations, error } = await supabaseAdmin
      .from('event_registrations')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(registrations);
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
