import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://waryursplsbgvxcvchaz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhcnl1cnNwbHNiZ3Z4Y3ZjaGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODUyNTEsImV4cCI6MjEwNzM2MTI1MX0.OM1wiF6uvPRZMMGG4WzFcwMoDBqQL0gM_OzsXd_E0BA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
