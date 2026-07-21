import { createAdminClient } from '../src/lib/supabase/admin.ts'

async function debug() {
  const supabase = await createAdminClient()
  const { data: policies, error } = await supabase
    .rpc('get_policies_for_table', { table_name: 'profiles' }) // wait, let's just query pg_policies table!
    
  // If rpc doesn't exist, we can use a direct SQL query or read pg_policies
  const { data: pgPolicies, error: pgError } = await supabase
    .from('pg_policies') // wait, pg_policies is a system view, we might not have direct postgrest exposure.
    // Instead of querying pg_policies, let's run direct SQL using admin client or check if we can query it.
    // Wait, is there a custom RPC? If not, we can run raw query using a scratch script.
    // Actually, let's just query pg_catalog.pg_policies through a custom query if possible.
    // But since Postgrest doesn't expose system catalog directly, let's see if we can do it via a simple SQL run.
    // Wait, do we have an RPC function we can call? Or we can just run a query on profiles as an anonymous client to see if it fails!
    
  console.log('Testing anonymous select on profiles...')
  // Let's create an anonymous client (using anon key but no auth)
  const { createClient } = await import('@supabase/supabase-js')
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data, error: anonError } = await anonClient
    .from('profiles')
    .select('id, shop_name')
    .limit(1)

  console.log('Anonymous client select result:', { data, anonError })
}

debug()



