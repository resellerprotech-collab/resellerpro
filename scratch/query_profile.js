const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhzywjqbpnonkxwvwstx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoenl3anFicG5vbmt4d3Z3c3R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk3NTkwOSwiZXhwIjoyMDc3NTUxOTA5fQ.NgUIAJ1G8c3lDYlW3BhmavxWm5owUDDb2bTr3aMnAcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, user_id, name, category, selling_price')
    .or('name.ilike.%gshock%,name.ilike.%shock%,name.ilike.%watch%,category.ilike.%watch%');

  console.log('Matching products across whole DB:', products);
}

run();
