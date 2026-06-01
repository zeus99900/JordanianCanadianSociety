import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  const { data: events, error } = await supabase.from('events').select('*');
  if (error) {
    console.error(error);
    return;
  }
  
  const idEvent = events.find(e => e.title.toLowerCase().includes('80'));
  if (idEvent) {
    console.log("Found event:", idEvent.title, idEvent.event_date);
    // Let's just modify the event_date to 16:30:00.000 ADT (UTC-3)
    // Wait, let's keep the existing date but change the time.
    const d = new Date(idEvent.event_date);
    // We can also add an "end_time" column?
    // Let's just output the data for now.
    console.log(idEvent);
  }
}

run();
