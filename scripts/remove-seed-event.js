const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function removeEvent() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Finding seed event...');
  
  // First, find the event ID to ensure we delete its registrations first if any exist
  const { data: events, error: fetchError } = await supabase
    .from('events')
    .select('id, title')
    .ilike('title', '%Summer Cultural Celebration%');
    
  if (fetchError) {
    console.error('❌ Failed to fetch event:', fetchError.message);
    process.exit(1);
  }

  if (events.length === 0) {
    console.log('Seed event not found. It might have already been deleted.');
    process.exit(0);
  }

  const eventId = events[0].id;
  console.log(`Found event: ${events[0].title} (ID: ${eventId})`);

  // Delete registrations first due to foreign key constraints
  console.log('Deleting associated registrations...');
  const { error: regError } = await supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', eventId);
    
  if (regError) {
    console.error('❌ Failed to delete registrations:', regError.message);
    process.exit(1);
  }

  // Delete the event
  console.log('Deleting event...');
  const { error: delError } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (delError) {
    console.error('❌ Failed to delete event:', delError.message);
    process.exit(1);
  }

  console.log('✅ Successfully removed the seed event!');
}

removeEvent();
