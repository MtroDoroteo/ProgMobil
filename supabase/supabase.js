import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uewftnxhdybtgadpkuvb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4LxAZ3F4Hb3waxgitMa_Zg_04ksiPtz';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);