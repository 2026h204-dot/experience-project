import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nrzgbhwodhnpbnarsnfn.supabase.co';
const supabaseAnonKey = 'sb_publishable_CV1APfZxWhBdQiuIp4dLgg_bAPTS92f';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
