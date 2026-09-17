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
  Trash2,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';
import {
  fetchAllRSVPs,
  fetchAllBlessings,
  resetAllData,
  isSupabaseConfigured,
  RSVPRecord,
  BlessingRecord,
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
  const [blessingRecords, setBlessingRecords] = useState<BlessingRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'blessings'>('rsvps');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
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
      const [rsvpsRes, blessingsRes] = await Promise.all([
        fetchAllRSVPs(),
        fetchAllBlessings(),
      ]);
      setRecords(rsvpsRes.records);
      setBlessingRecords(blessingsRes.records);
      setIsLive(rsvpsRes.isLive || blessingsRes.isLive);
      if (rsvpsRes.error) setError(rsvpsRes.error);
    } catch (e: any) {
      setError(e?.message || 'Failed to load records');
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

  const handleResetAllData = async () => {
    setIsResetting(true);
    setError(null);
    try {
      const res = await resetAllData();
      if (res.success) {
        setRecords([]);
        setBlessingRecords([]);
        setShowResetConfirm(false);
        setResetSuccessMessage('All test data has been completely cleared from both tables!');
        setTimeout(() => setResetSuccessMessage(null), 4500);
      } else {
        setError(res.error || 'Failed to clear data from Supabase');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to reset test data');
    } finally {
      setIsResetting(false);
    }
  };

  const filteredRSVPs = records.filter((r) => {
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

  const filteredBlessings = blessingRecords.filter((b) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'yes'
        ? b.attendance?.toLowerCase() === 'yes'
        : b.attendance?.toLowerCase() === 'no';

    const matchesSearch =
      !search.trim() ||
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.dua?.toLowerCase().includes(search.toLowerCase()) ||
      b.relation?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    if (activeTab === 'rsvps') {
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
    } else {
      if (blessingRecords.length === 0) return;
      const headers = ['Guest Name', 'Relation', 'Attendance', 'Dua / Blessing', 'Submitted At'];
      const rows = blessingRecords.map((b) => [
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${(b.relation || '').replace(/"/g, '""')}"`,
        `"${b.attendance === 'yes' ? 'Attending' : 'Not Attending'}"`,
        `"${(b.dua || '').replace(/"/g, '""')}"`,
        `"${b.created_at ? new Date(b.created_at).toLocaleString() : ''}"`,
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'wedding_blessings_guestbook.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const sqlSetupSnippet = `-- Run this in Supabase SQL Editor to support both tables:
-- 1. RSVPs Table (Countdown responses)
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null default 'Anonymous RSVP',
  attendance text not null,
  relation text,
  wishes text
);

alter table public.rsvps enable row level security;
create policy "Allow anonymous inserts" on public.rsvps for insert to anon with check (true);
create policy "Allow anonymous reads" on public.rsvps for select to anon using (true);
create policy "Allow anonymous deletes" on public.rsvps for delete to anon using (true);

-- 2. Blessings Table (Dedicated Guestbook Duas)
create table if not exists public.blessings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null,
  relation text,
  attendance text,
  dua text not null
);

alter table public.blessings enable row level security;
create policy "Allow anonymous blessings insert" on public.blessings for insert to anon with check (true);
create policy "Allow anonymous blessings read" on public.blessings for select to anon using (true);
create policy "Allow anonymous blessings delete" on public.blessings for delete to anon using (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSetupSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border-2 border-amber-400/60 bg-[#0e172e] text-stone-100 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-400/30 bg-[#141f3d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl text-amber-100 font-medium">
                Wedding Response &amp; Registry Dashboard
              </h3>
              <p className="text-xs text-stone-400">
                Dr. Fathima &amp; Anas • Private Admin View
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-sans-ui transition-colors cursor-pointer"
              title="Reset All Test Data"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset All Test Data</span>
              <span className="sm:hidden">Reset</span>
            </button>

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
        <div className="px-6 py-2 bg-[#0b1226] border-b border-stone-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Database Status:</span>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected (Live)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Local Storage Mode (Add Vercel Supabase env keys to sync cloud)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={copySql}
            className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 underline cursor-pointer"
          >
            {copiedSql ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied SQL Schema for Both Tables!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Supabase SQL Setup (Tables &amp; Policies)</span>
              </>
            )}
          </button>
        </div>

        {/* Success Alert Banner */}
        {resetSuccessMessage && (
          <div className="px-6 py-2.5 bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setResetSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* =====================================================================
            TOP EXPLICIT COUNTERS
            "Total Confirmed Guests (Yes)" and "Total Regrets (No)"
            ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 sm:p-5 bg-[#111a36]/80 border-b border-stone-800">
          {/* 1. Total Confirmed Guests (Yes) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border-2 border-emerald-500/40 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs sm:text-sm font-sans-ui text-emerald-300 font-semibold uppercase tracking-wider mb-1">
                Total Confirmed Guests (Yes)
              </div>
              <div className="text-xs text-stone-400">
                Guests attending Dr. Fathima &amp; Anas&apos;s wedding
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-400/40">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span className="text-2xl sm:text-3xl font-display font-bold text-emerald-200">
                {attendingCount}
              </span>
            </div>
          </div>

          {/* 2. Total Regrets (No) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-rose-900/30 border-2 border-rose-500/40 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs sm:text-sm font-sans-ui text-rose-300 font-semibold uppercase tracking-wider mb-1">
                Total Regrets (No)
              </div>
              <div className="text-xs text-stone-400">
                Guests unable to make it in person
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-rose-500/20 px-4 py-2 rounded-xl border border-rose-400/40">
              <XCircle className="w-6 h-6 text-rose-400" />
              <span className="text-2xl sm:text-3xl font-display font-bold text-rose-200">
                {declinedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-stone-800 bg-[#0d162d]">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('rsvps')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'rsvps'
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-400/50 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>RSVPs Table ({totalCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('blessings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'blessings'
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-400/50 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Dua &amp; Blessings Table ({blessingRecords.length})</span>
            </button>
          </div>

          {/* Search & Filter & Export */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-white/5 border border-stone-700 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="inline-flex rounded-lg border border-stone-700 bg-white/5 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-amber-400/20 text-amber-300 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('yes')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filter === 'yes'
                    ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFilter('no')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filter === 'no'
                    ? 'bg-rose-500/20 text-rose-300 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                No
              </button>
            </div>

            <button
              type="button"
              onClick={exportCSV}
              disabled={activeTab === 'rsvps' ? records.length === 0 : blessingRecords.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-y-auto max-h-[380px] p-4 sm:p-6">
          {activeTab === 'rsvps' ? (
            filteredRSVPs.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-sm">
                <Users className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p>No RSVP records match the current filter in table &apos;rsvps&apos;.</p>
                <p className="text-xs text-stone-500 mt-1">
                  Countdown button responses will appear here as soon as guests click!
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
                      <th className="px-4 py-3 font-semibold">Wishes / Notes</th>
                      <th className="px-3 py-3 font-semibold">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-sans-ui">
                    {filteredRSVPs.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          {item.name || 'Anonymous RSVP'}
                        </td>
                        <td className="px-3 py-3">
                          {item.attendance?.toLowerCase() === 'yes' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Attending (Yes)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-[11px] font-medium">
                              <XCircle className="w-3 h-3 text-rose-400" />
                              Regrets (No)
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
            )
          ) : (
            filteredBlessings.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-sm">
                <HeartHandshake className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p>No records found in table &apos;blessings&apos;.</p>
                <p className="text-xs text-stone-500 mt-1">
                  Guestbook Duas and blessings will appear here when guests submit the Dua form.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-stone-800 bg-[#091024]">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-[#121c3b] text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Guest Name</th>
                      <th className="px-3 py-3 font-semibold">Relation</th>
                      <th className="px-3 py-3 font-semibold">Attendance</th>
                      <th className="px-4 py-3 font-semibold">Blessing / Dua Message</th>
                      <th className="px-3 py-3 font-semibold">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-sans-ui">
                    {filteredBlessings.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          {item.name}
                        </td>
                        <td className="px-3 py-3 text-stone-400">
                          {item.relation || 'Guest'}
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
                        <td className="px-4 py-3 text-stone-200 max-w-sm font-arabic">
                          {item.dua}
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
            )
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-stone-800 bg-[#0a1124] text-[11px] text-stone-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            {activeTab === 'rsvps'
              ? `Showing ${filteredRSVPs.length} of ${totalCount} countdown responses`
              : `Showing ${filteredBlessings.length} of ${blessingRecords.length} guestbook blessings`}
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

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#141f3d] border-2 border-rose-500/60 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3.5 border border-rose-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-display font-semibold text-white mb-2">
                Reset All Test Data?
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed font-sans-ui">
                This will run a delete query to completely clear out all records from <strong>both the &apos;rsvps&apos; and &apos;blessings&apos; tables</strong> so you can empty out test submissions before sending the link to family. This cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetAllData}
                  disabled={isResetting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isResetting ? (
                    <span>Clearing tables...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Reset All Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
