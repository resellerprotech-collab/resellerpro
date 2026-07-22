const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhzywjqbpnonkxwvwstx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoenl3anFicG5vbmt4d3Z3c3R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk3NTkwOSwiZXhwIjoyMDc3NTUxOTA5fQ.NgUIAJ1G8c3lDYlW3BhmavxWm5owUDDb2bTr3aMnAcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const userId = '4934d9be-8cdb-4b62-b0ab-a40dcbfaa943';
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    console.log(`Orders count for user ${userId}:`, count);
  }
}

run();
