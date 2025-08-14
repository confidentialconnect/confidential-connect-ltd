import { createClient } from '@supabase/supabase-js'

// Since this project has Supabase natively connected, the credentials will be automatically injected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)