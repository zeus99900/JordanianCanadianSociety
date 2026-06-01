const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function addEvent() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check if events table exists by making a simple query
  const { error: checkError } = await supabase.from('events').select('id').limit(1);
  
  if (checkError) {
    console.error('❌ Could not query the events table. Did you run the migration script in Supabase?');
    console.error('Error details:', checkError.message);
    process.exit(1);
  }

  const eventData = {
    title: 'Jordan 80 Independence Day',
    title_ar: 'حفل عيد الاستقلال الاردني',
    description: "Hosted by Jordanian Canadian Nashama Society.\n\nGet ready to be part of something extraordinary at Jordanian Canadian Nashama Society's event. It's an event like no other, and we want you to be there!",
    // June 6, 2026 at 4:30 PM Halifax Time (ADT is UTC-3)
    event_date: '2026-06-06T16:30:00-03:00',
    location: '321 Main Ave, Halifax, NS B3S 0B5, Canada',
    price_adult_cents: 2000, // $20.00
    price_kid_cents: 0,      // Children are free
    is_active: true
  };

  console.log('Adding event...');
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select();

  if (error) {
    console.error('❌ Failed to add event:', error.message);
    process.exit(1);
  }

  console.log('✅ Successfully added event!');
  console.log(data[0]);
}

addEvent();
