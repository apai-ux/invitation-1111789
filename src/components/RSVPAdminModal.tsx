import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCw,
  Database,
  Search,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  fetchAllRSVPs,
  isSupabaseConfigured,
  RSVPRecord,
} from '../utils/supabaseClient';

interface RSVPAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RSVPAdminModal: React.FC<RSVPAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [search, setSearch] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  const isConfigured = isSupabaseConfigured();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAllRSVPs();
      setRecords(res.records);
      setIsLive(res.isLive);
      if (res.error) setError(res.error);
    } catch (e: any) {
      setError(e?.message || 'Failed to load RSVPs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCount = records.length;
  const attendingCount = records.filter(
    (r) => r.attendance?.toLowerCase() === 'yes'
  ).length;
  const declinedCount = records.filter(
    (r) => r.attendance?.toLowerCase() === 'no'
  ).length;

  const filtered = records.filter((r) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'yes'
        ? r.attendance?.toLowerCase() === 'yes'
        : r.attendance?.toLowerCase() === 'no';

    const matchesSearch =
      !search.trim() ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.wishes?.toLowerCase().includes(search.toLowerCase()) ||
      r.relation?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Name', 'Attendance', 'Relation', 'Wishes', 'Submitted At'];
    const rows = records.map((r) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.attendance === 'yes' ? 'Attending' : 'Not Attending'}"`,
      `"${(r.relation || '').replace(/"/g, '""')}"`,
      `"${(r.wishes || '').replace(/"/g, '""')}"`,
      `"${r.created_at ? new Date(r.created_at).toLocaleString() : ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'wedding_rsvps_fathima_anas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sqlSetupSnippet = `-- Run this in Supabase SQL Editor:
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null,
  attendance text not null,
  relation text,
  wishes text
);

-- Allow guests to submit RSVPs and view wishes
alter table public.rsvps enable row level security;

create policy "Allow anonymous submissions"
  on public.rsvps for insert
  to anon
  with check (true);

create policy "Allow anonymous reads"
  on public.rsvps for select
  to anon
  using (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSetupSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-amber-400/60 bg-[#0e172e] text-stone-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-400/30 bg-[#141f3d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl text-amber-100 font-medium">
                Guest RSVP &amp; Response Table
              </h3>
              <p className="text-xs text-stone-400">
                Dr. Fathima &amp; Anas Wedding Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors cursor-pointer"
              title="Refresh records"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Supabase Status Banner */}
        <div className="px-6 py-2.5 bg-[#0b1226] border-b border-stone-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Database Status:</span>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Browser Local Storage (Add Supabase keys in Vercel to sync cloud)
              </span>
            )}
          </div>

          {!isConfigured && (
            <button
              type="button"
              onClick={copySql}
              className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied SQL Table Schema!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Supabase SQL Setup</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3 p-4 sm:p-6 bg-[#111a36]/60 border-b border-stone-800 text-center">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-display font-semibold text-white">
              {totalCount}
            </div>
            <div className="text-[11px] sm:text-xs text-stone-400 font-sans-ui uppercase tracking-wider">
              Total Responses
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <div className="text-xl sm:text-2xl font-display font-semibold text-emerald-300">
              {attendingCount}
            </div>
            <div className="text-[11px] sm:text-xs text-emerald-400/90 font-sans-ui uppercase tracking-wider">
              Attending (Yes)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
            <div className="text-xl sm:text-2xl font-display font-semibold text-rose-300">
              {declinedCount}
            </div>
            <div className="text-[11px] sm:text-xs text-rose-400/90 font-sans-ui uppercase tracking-wider">
              Regrets (No)
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-stone-800 bg-[#0d162d]">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or wish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-stone-700 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="inline-flex rounded-lg border border-stone-700 bg-white/5 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-amber-400/20 text-amber-300 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('yes')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filter === 'yes'
                    ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Yes ({attendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('no')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filter === 'no'
                    ? 'bg-rose-500/20 text-rose-300 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                No ({declinedCount})
              </button>
            </div>

            <button
              type="button"
              onClick={exportCSV}
              disabled={records.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="flex-1 overflow-y-auto max-h-[420px] p-4 sm:p-6">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              <Users className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p>No RSVP records match the current filter.</p>
              <p className="text-xs text-stone-500 mt-1">
                Guest responses will appear here as soon as they respond!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-800 bg-[#091024]">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#121c3b] text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Guest Name</th>
                    <th className="px-3 py-3 font-semibold">Attendance</th>
                    <th className="px-3 py-3 font-semibold">Relation</th>
                    <th className="px-4 py-3 font-semibold">Wishes &amp; Duas</th>
                    <th className="px-3 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans-ui">
                  {filtered.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {item.name}
                      </td>
                      <td className="px-3 py-3">
                        {item.attendance?.toLowerCase() === 'yes' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Attending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-[11px] font-medium">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            Regrets
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-stone-400">
                        {item.relation || '—'}
                      </td>
                      <td className="px-4 py-3 text-stone-300 max-w-xs truncate italic">
                        {item.wishes ? `"${item.wishes}"` : '—'}
                      </td>
                      <td className="px-3 py-3 text-stone-500 whitespace-nowrap text-[11px]">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              undefined,
                              { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )
                          : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-stone-800 bg-[#0a1124] text-[11px] text-stone-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            Showing {filtered.length} of {totalCount} guest responses
          </span>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200"
          >
            <span>Open Supabase Table Editor</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
