import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AlbumStateRow {
  id: string;
  collected: Record<string, boolean>;
  duplicates: Record<string, number>;
  updated_at: string;
}

export interface SuggestionRow {
  id: string;
  author: string;
  text: string;
  created_at: string;
}
