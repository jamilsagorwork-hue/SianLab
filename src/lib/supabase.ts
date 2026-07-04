import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://aoldsjbmvpcvulrakqav.supabase.co';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbGRzamJtdnBjdnVscmFrcWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMzcxNjcsImV4cCI6MjA5ODcxMzE2N30.qwNDzotY1TsX_jF7HJJA_9Trd2CucjHrFoo4LXmvxRc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
