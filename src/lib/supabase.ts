import { createClient } from '@supabase/supabase-js'
import { env } from './env'

console.log('🏗️ Supabase Client Debug:');
console.log('- Supabase URL:', env.NEXT_PUBLIC_SUPABASE_URL);
console.log('- Has anon key:', !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)