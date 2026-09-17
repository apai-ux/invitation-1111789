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
  name?: string;
  attendance: 'yes' | 'no' | string;
  relation?: string;
  wishes?: string;
}

export interface BlessingRecord {
  id?: string;
  created_at?: string;
  name: string;
  relation?: string;
  attendance?: 'yes' | 'no' | string;
  dua: string;
}

const LOCAL_STORAGE_KEY = 'wedding_rsvps_records';
const LOCAL_STORAGE_BLESSINGS_KEY = 'wedding_blessings_records';

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

// Helper to get local blessings as fallback
const getLocalBlessings = (): BlessingRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BLESSINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Helper to save blessing to localStorage as fallback
const saveLocalBlessing = (record: BlessingRecord): BlessingRecord[] => {
  try {
    const existing = getLocalBlessings();
    const updated = [record, ...existing.filter((b) => b.id !== record.id)];
    localStorage.setItem(LOCAL_STORAGE_BLESSINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [record];
  }
};

/**
 * Submit or update a guest RSVP record (Name, Attendance, Wishes, Relation)
 * Automatically defaults name to 'Anonymous RSVP' if omitted.
 */
export const submitRSVP = async (
  record: {
    id?: string;
    name?: string;
    attendance: 'yes' | 'no' | string;
    relation?: string;
    wishes?: string;
  }
): Promise<{ success: boolean; data?: RSVPRecord; error?: string }> => {
  const guestName = record.name?.trim() ? record.name.trim() : 'Anonymous RSVP';
  const newRecord: RSVPRecord = {
    id: record.id || Date.now().toString(),
    created_at: new Date().toISOString(),
    name: guestName,
    attendance: record.attendance,
    relation: record.relation || 'Guest',
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

/**
 * Submit an entry to the dedicated 'blessings' table
 */
export const submitBlessing = async (
  record: {
    id?: string;
    name: string;
    relation?: string;
    attendance?: 'yes' | 'no' | string;
    dua: string;
  }
): Promise<{ success: boolean; data?: BlessingRecord; error?: string }> => {
  const newBlessing: BlessingRecord = {
    id: record.id || Date.now().toString(),
    created_at: new Date().toISOString(),
    name: record.name.trim() || 'Well-wisher',
    relation: record.relation || 'Friend / Family',
    dua: record.dua.trim(),
  };

  if (record.attendance) {
    newBlessing.attendance = record.attendance;
  }

  saveLocalBlessing(newBlessing);

  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: true,
      data: newBlessing,
      error: 'Supabase credentials not set. Blessing saved locally in browser.',
    };
  }

  try {
    const insertPayload: Record<string, any> = {
      name: newBlessing.name,
      relation: newBlessing.relation,
      dua: newBlessing.dua,
    };
    if (newBlessing.attendance) {
      insertPayload.attendance = newBlessing.attendance;
    }

    const { data, error } = await supabase
      .from('blessings')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.warn('Supabase blessings insert warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as BlessingRecord };
  } catch (err: any) {
    console.error('Supabase blessings exception:', err);
    return { success: false, error: err?.message || 'Failed to submit blessing' };
  }
};

/**
 * Fetch recent entries from the dedicated 'blessings' table (ordered by created_at desc, limit 3)
 */
export const fetchRecentBlessings = async (limitCount: number = 3): Promise<{
  records: BlessingRecord[];
  isLive: boolean;
  error?: string;
}> => {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      records: getLocalBlessings().slice(0, limitCount),
      isLive: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('blessings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) {
      console.warn('Supabase blessings fetch error:', error);
      return {
        records: getLocalBlessings().slice(0, limitCount),
        isLive: false,
        error: error.message,
      };
    }

    return {
      records: (data as BlessingRecord[]) || [],
      isLive: true,
    };
  } catch (err: any) {
    return {
      records: getLocalBlessings().slice(0, limitCount),
      isLive: false,
      error: err?.message,
    };
  }
};

/**
 * Fetch all entries from the dedicated 'blessings' table
 */
export const fetchAllBlessings = async (): Promise<{
  records: BlessingRecord[];
  isLive: boolean;
  error?: string;
}> => {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      records: getLocalBlessings(),
      isLive: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('blessings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase blessings fetch error:', error);
      return {
        records: getLocalBlessings(),
        isLive: false,
        error: error.message,
      };
    }

    return {
      records: (data as BlessingRecord[]) || [],
      isLive: true,
    };
  } catch (err: any) {
    return {
      records: getLocalBlessings(),
      isLive: false,
      error: err?.message,
    };
  }
};

/**
 * Reset all test data from both 'rsvps' and 'blessings' tables
 */
export const resetAllData = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  // Clear local storage backups
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_BLESSINGS_KEY);
    localStorage.removeItem('wedding_rsvp_attendance');
  } catch {}

  const supabase = getSupabase();
  if (!supabase) {
    return { success: true };
  }

  try {
    // In Supabase, delete() requires a filter unless using neq with an impossible value
    const [rsvpsRes, blessingsRes] = await Promise.all([
      supabase.from('rsvps').delete().neq('attendance', '___non_existent_value___'),
      supabase.from('blessings').delete().neq('name', '___non_existent_value___'),
    ]);

    if (rsvpsRes.error) {
      console.warn('Supabase rsvps delete warning:', rsvpsRes.error);
    }
    if (blessingsRes.error) {
      console.warn('Supabase blessings delete warning:', blessingsRes.error);
    }

    return {
      success: !rsvpsRes.error && !blessingsRes.error,
      error: rsvpsRes.error?.message || blessingsRes.error?.message,
    };
  } catch (err: any) {
    console.error('Reset exception:', err);
    return { success: false, error: err?.message || 'Failed to reset data' };
  }
};
