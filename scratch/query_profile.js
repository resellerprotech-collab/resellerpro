const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhzywjqbpnonkxwvwstx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoenl3anFicG5vbmt4d3Z3c3R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk3NTkwOSwiZXhwIjoyMDc3NTUxOTA5fQ.NgUIAJ1G8c3lDYlW3BhmavxWm5owUDDb2bTr3aMnAcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, business_name, shop_slug')
    .or('shop_slug.is.null,shop_slug.eq.""');

  if (error) {
    console.error('Error fetching null shop_slugs:', error);
    return;
  }

  console.log(`Found ${profiles.length} remaining profiles with missing shop_slug.`);

  for (const profile of profiles) {
    const rawName = profile.business_name || (profile.email ? profile.email.split('@')[0] : 'shop');
    let cleanSlug = rawName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanSlug || cleanSlug.length < 3) cleanSlug = 'shop';
    cleanSlug = `${cleanSlug}-${profile.id.slice(0, 4)}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ shop_slug: cleanSlug })
      .eq('id', profile.id);

    if (updateError) {
      console.error(`Failed to update user ${profile.id}:`, updateError.message);
    } else {
      console.log(`Updated user ${profile.email || profile.id} -> shop_slug: ${cleanSlug}`);
    }
  }

  console.log('All remaining profiles backfilled successfully!');
}

run();
