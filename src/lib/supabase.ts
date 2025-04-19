
import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
const supabaseUrl = 'https://xdorldvsqgcnftplqeav.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkb3JsZHZzcWdjbmZ0cGxxZWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODQ2OTcsImV4cCI6MjA2MDY2MDY5N30.2_PFcwJiImNtRlPzGU1YReUZX6LWMtVawffRCetyueA';

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
