const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhzywjqbpnonkxwvwstx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoenl3anFicG5vbmt4d3Z3c3R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk3NTkwOSwiZXhwIjoyMDc3NTUxOTA5fQ.NgUIAJ1G8c3lDYlW3BhmavxWm5owUDDb2bTr3aMnAcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Rename raz@gmail.com to razstore
  await supabase
    .from('profiles')
    .update({ shop_slug: 'razstore' })
    .eq('id', '5bd9e4dc-9193-4eef-a552-2ce5dc392a87');

  // Set mhdrashid142@gmail.com (main account with 28 products) to rashidstore
  await supabase
    .from('profiles')
    .update({ shop_slug: 'rashidstore' })
    .eq('id', '4934d9be-8cdb-4b62-b0ab-a40dcbfaa943');

  console.log('Successfully set mhdrashid142@gmail.com shop_slug to rashidstore!');
}

run();
