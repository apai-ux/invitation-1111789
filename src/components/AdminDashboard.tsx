import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
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
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  fetchAllRSVPs,
  fetchAllBlessings,
  resetAllData,
  isSupabaseConfigured,
  RSVPRecord,
  BlessingRecord,
} from '../utils/supabaseClient';

interface AdminDashboardProps {
  onBackToInvitation: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToInvitation,
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
    loadData();
  }, []);

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
    <div className="min-h-screen w-full bg-[#080e1e] text-stone-100 font-sans-ui selection:bg-amber-400 selection:text-stone-900 pb-16">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-amber-500/20 bg-[#0d162d]/95 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToInvitation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-400/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>← Back to Invitation</span>
            </button>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-display font-medium text-white">
                  Secret Admin Dashboard
                </h1>
                <p className="text-[11px] text-stone-400">
                  Dr. Fathima &amp; Anas • Private Host View
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/50 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow-rose-950/50 active:scale-95"
              title="Reset All Test Data"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset All Test Data</span>
            </button>

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 transition-colors cursor-pointer border border-white/10"
              title="Refresh records"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        
        {/* Secret URL Confirmation Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-amber-300">Private Host URL Active: </span>
              This dashboard is completely hidden from the public wedding invitation. You can bookmark or access it anytime via <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">/admin-dashboard</code> or <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">?admin=true</code>.
            </div>
          </div>

          <button
            type="button"
            onClick={copySql}
            className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-100 underline shrink-0 cursor-pointer"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Supabase SQL Setup!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Supabase SQL Setup</span>
              </>
            )}
          </button>
        </div>

        {/* Success Alert Banner */}
        {resetSuccessMessage && (
          <div className="mb-6 px-5 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between animate-fadeIn shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{resetSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setResetSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Database Status Pill */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Database Connection:</span>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected (Live Table Sync)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Browser Local Storage (Add Vercel env keys to sync to Supabase)
              </span>
            )}
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200"
          >
            <span>Open Supabase Web Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* =====================================================================
            TOP EXPLICIT CLEAR COUNTERS
            "Total Confirmed Guests (Yes)" and "Total Regrets (No)"
            ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* 1. Total Confirmed Guests (Yes) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-emerald-900/40 to-[#0e1f26] border-2 border-emerald-500/50 flex items-center justify-between shadow-xl">
            <div>
              <div className="text-xs sm:text-sm font-sans-ui text-emerald-300 font-bold uppercase tracking-wider mb-1.5">
                Total Confirmed Guests (Yes)
              </div>
              <div className="text-xs text-stone-400">
                Guests attending in person
              </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-500/20 px-4 sm:px-5 py-2.5 rounded-2xl border border-emerald-400/40">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              <span className="text-3xl sm:text-4xl font-display font-bold text-emerald-200">
                {attendingCount}
              </span>
            </div>
          </div>

          {/* 2. Total Regrets (No) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-950/70 via-rose-900/40 to-[#220f17] border-2 border-rose-500/50 flex items-center justify-between shadow-xl">
            <div>
              <div className="text-xs sm:text-sm font-sans-ui text-rose-300 font-bold uppercase tracking-wider mb-1.5">
                Total Regrets (No)
              </div>
              <div className="text-xs text-stone-400">
                Guests unable to make it
              </div>
            </div>
            <div className="flex items-center gap-3 bg-rose-500/20 px-4 sm:px-5 py-2.5 rounded-2xl border border-rose-400/40">
              <XCircle className="w-7 h-7 text-rose-400" />
              <span className="text-3xl sm:text-4xl font-display font-bold text-rose-200">
                {declinedCount}
              </span>
            </div>
          </div>

          {/* 3. Total Dua & Blessings Guestbook */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 via-amber-900/30 to-[#1e1710] border-2 border-amber-400/40 sm:col-span-2 lg:col-span-1 flex items-center justify-between shadow-xl">
            <div>
              <div className="text-xs sm:text-sm font-sans-ui text-amber-300 font-bold uppercase tracking-wider mb-1.5">
                Total Dua &amp; Blessings
              </div>
              <div className="text-xs text-stone-400">
                Prayers in guestbook table
              </div>
            </div>
            <div className="flex items-center gap-3 bg-amber-500/20 px-4 sm:px-5 py-2.5 rounded-2xl border border-amber-400/40">
              <HeartHandshake className="w-7 h-7 text-amber-400" />
              <span className="text-3xl sm:text-4xl font-display font-bold text-amber-200">
                {blessingRecords.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Table Controls Card */}
        <div className="rounded-3xl border border-amber-400/30 bg-[#0d162d] overflow-hidden shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-b border-stone-800 bg-[#121c3b]">
            {/* Tabs */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('rsvps')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'rsvps'
                    ? 'bg-amber-400/25 text-amber-200 border border-amber-400/50 shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>RSVPs Table ({totalCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('blessings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'blessings'
                    ? 'bg-amber-400/25 text-amber-200 border border-amber-400/50 shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Dua &amp; Blessings Guestbook ({blessingRecords.length})</span>
              </button>
            </div>

            {/* Search, Filter & CSV Export */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white/5 border border-stone-700 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="inline-flex rounded-xl border border-stone-700 bg-white/5 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
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
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
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
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[360px]">
            {activeTab === 'rsvps' ? (
              filteredRSVPs.length === 0 ? (
                <div className="py-16 text-center text-stone-400 text-sm">
                  <Users className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                  <p className="font-medium text-stone-300">No RSVP records found in table &apos;rsvps&apos;</p>
                  <p className="text-xs text-stone-500 mt-1">
                    When guests click &quot;Yes, with joy!&quot; or &quot;Sorry, I can&apos;t make it&quot;, submissions appear here automatically.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-[#0b1226] text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Guest Identification</th>
                      <th className="px-4 py-4 font-semibold">Attendance Response</th>
                      <th className="px-4 py-4 font-semibold">Relation</th>
                      <th className="px-6 py-4 font-semibold">Wishes / Remarks</th>
                      <th className="px-4 py-4 font-semibold">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 font-sans-ui">
                    {filteredRSVPs.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-6 py-3.5 font-medium text-white">
                          {item.name || 'Anonymous RSVP'}
                        </td>
                        <td className="px-4 py-3.5">
                          {item.attendance?.toLowerCase() === 'yes' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Attending (Yes)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs font-semibold">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              Regrets (No)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-stone-400">
                          {item.relation || '—'}
                        </td>
                        <td className="px-6 py-3.5 text-stone-300 max-w-sm truncate italic">
                          {item.wishes ? `"${item.wishes}"` : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap text-[11px]">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              filteredBlessings.length === 0 ? (
                <div className="py-16 text-center text-stone-400 text-sm">
                  <HeartHandshake className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                  <p className="font-medium text-stone-300">No records found in table &apos;blessings&apos;</p>
                  <p className="text-xs text-stone-500 mt-1">
                    When guests submit the dedicated Dua &amp; Blessings form, their personal prayers appear here.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-[#0b1226] text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Guest Name</th>
                      <th className="px-4 py-4 font-semibold">Relation</th>
                      <th className="px-4 py-4 font-semibold">Attendance</th>
                      <th className="px-6 py-4 font-semibold">Dua / Blessing Message</th>
                      <th className="px-4 py-4 font-semibold">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 font-sans-ui">
                    {filteredBlessings.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-6 py-3.5 font-medium text-white">
                          {item.name}
                        </td>
                        <td className="px-4 py-3.5 text-stone-400">
                          {item.relation || 'Guest'}
                        </td>
                        <td className="px-4 py-3.5">
                          {item.attendance?.toLowerCase() === 'yes' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Attending
                            </span>
                          ) : item.attendance?.toLowerCase() === 'no' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs font-semibold">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              Regrets
                            </span>
                          ) : (
                            <span className="text-stone-500 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-stone-200 max-w-md font-arabic text-sm">
                          {item.dua}
                        </td>
                        <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap text-[11px]">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>

          <div className="px-6 py-3.5 border-t border-stone-800 bg-[#0b1226] text-xs text-stone-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              {activeTab === 'rsvps'
                ? `Showing ${filteredRSVPs.length} of ${totalCount} countdown responses`
                : `Showing ${filteredBlessings.length} of ${blessingRecords.length} guestbook blessings`}
            </span>
            <span className="text-stone-500">
              Auto-syncs with your Supabase database
            </span>
          </div>
        </div>
      </main>

      {/* Safety Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#141f3d] border-2 border-rose-500/60 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3.5 border border-rose-500/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white mb-2">
              Reset All Test Data?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mb-6 leading-relaxed font-sans-ui">
              This will execute a delete query to completely clear out all records from <strong>both the &apos;rsvps&apos; and &apos;blessings&apos; tables</strong> so you can empty out test submissions before sending the link to family. This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetAllData}
                disabled={isResetting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isResetting ? (
                  <span>Clearing tables...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Reset All Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
