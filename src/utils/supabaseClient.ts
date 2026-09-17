import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 10
  );
};

// Singleton client instance
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export interface RSVPRecord {
  id?: string;
  created_at?: string;
  name: string;
  attendance: 'yes' | 'no' | string;
  relation?: string;
  wishes?: string;
}

const LOCAL_STORAGE_KEY = 'wedding_rsvps_records';

// Helper to get local records as fallback
const getLocalRecords = (): RSVPRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Helper to save to localStorage as fallback
const saveLocalRecord = (record: RSVPRecord): RSVPRecord[] => {
  try {
    const existing = getLocalRecords();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [record];
  }
};

/**
 * Submit or update a guest RSVP record (Name, Attendance, Wishes, Relation)
 */
export const submitRSVP = async (
  record: Omit<RSVPRecord, 'id' | 'created_at'> & { id?: string }
): Promise<{ success: boolean; data?: RSVPRecord; error?: string }> => {
  const newRecord: RSVPRecord = {
    id: record.id || Date.now().toString(),
    created_at: new Date().toISOString(),
    name: record.name.trim(),
    attendance: record.attendance,
    relation: record.relation || 'Friend / Family',
    wishes: record.wishes ? record.wishes.trim() : '',
  };

  // Always back up to local storage
  saveLocalRecord(newRecord);

  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: true,
      data: newRecord,
      error: 'Supabase credentials not set. Response saved locally in browser.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('rsvps')
      .insert([
        {
          name: newRecord.name,
          attendance: newRecord.attendance,
          relation: newRecord.relation,
          wishes: newRecord.wishes,
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as RSVPRecord };
  } catch (err: any) {
    console.error('Supabase exception:', err);
    return { success: false, error: err?.message || 'Failed to submit RSVP' };
  }
};

/**
 * Fetch all RSVPs for the couple to view
 */
export const fetchAllRSVPs = async (): Promise<{
  records: RSVPRecord[];
  isLive: boolean;
  error?: string;
}> => {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      records: getLocalRecords(),
      isLive: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error);
      return {
        records: getLocalRecords(),
        isLive: false,
        error: error.message,
      };
    }

    // Merge with any offline local records that might not be synced
    return {
      records: (data as RSVPRecord[]) || [],
      isLive: true,
    };
  } catch (err: any) {
    return {
      records: getLocalRecords(),
      isLive: false,
      error: err?.message,
    };
  }
};
