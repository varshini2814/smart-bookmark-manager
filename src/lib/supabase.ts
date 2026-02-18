import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfjixlwauraefwgyjmpv.supabase.co';
const supabaseAnonKey = 'sb_publishable_sHANeVno46v85eEK89CsxQ_1DEAyfoF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);