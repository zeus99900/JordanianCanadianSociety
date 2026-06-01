const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function updateEventImage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Finding event...');
  
  const { data: events, error: fetchError } = await supabase
    .from('events')
    .select('id, title')
    .ilike('title', '%Jordan 80%');
    
  if (fetchError) {
    console.error('❌ Failed to fetch event:', fetchError.message);
    process.exit(1);
  }

  if (events.length === 0) {
    console.log('Event not found.');
    process.exit(0);
  }

  const eventId = events[0].id;
  console.log(`Found event: ${events[0].title} (ID: ${eventId})`);

  // Update the image_url
  console.log('Updating event image...');
  const { error: updateError } = await supabase
    .from('events')
    .update({ image_url: '/images/jordan-80.png' })
    .eq('id', eventId);

  if (updateError) {
    console.error('❌ Failed to update event:', updateError.message);
    process.exit(1);
  }

  console.log('✅ Successfully updated the event image URL!');
}

updateEventImage();
