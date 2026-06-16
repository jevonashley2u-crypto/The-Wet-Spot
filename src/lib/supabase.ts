import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wzeppdvxpqflkefozipv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZXBwZHZ4cHFmbGtlZm96aXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzMwMzEsImV4cCI6MjA5NzE0OTAzMX0.zSkbjs4-rQklVTp6FmE8drkpRun9ZbddBxBhpuHKgEw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
