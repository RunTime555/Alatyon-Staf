"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Beaker, FlaskConical, ClipboardCheck, LayoutDashboard,
  Settings, LogOut, Menu, X, Search, Filter,
  Clock3, CheckCircle2, AlertCircle, ChevronDown
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/lab" },
  { icon: FlaskConical,    label: "Upload Results", href: "/lab/upload" },
  { icon: ClipboardCheck,  label: "Recent Uploads", href: "/lab/recent", active: true },
  
];

const STATUS_MAP = {
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   label: "Pending",  icon: Clock3 },
  reviewed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Reviewed", icon: CheckCircle2 },
  default:  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    label: "Uploaded", icon: FlaskConical },
};

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#003a66] flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:shrink-0`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <Beaker size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-none">Alatyon</p>
              <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mt-0.5">Lab System</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-white/50 hover:text-white"><X size={18} /></button>
        </div>
        <nav className="flex-1 py-5 px-3 space-y-1">
          {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all
                ${active ? "bg-blue-500 text-white" : "text-white/50 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={17} className="shrink-0" />{label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">LT</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Lab Technician</p>
            <p className="text-white/40 text-[10px]">Alatyon Lab</p>
          </div>
          <LogOut size={14} className="text-white/30 hover:text-white cursor-pointer" />
        </div>
      </aside>
    </>
  );
}

export default function LabRecentUploads() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter]   = useState(false);

  useEffect(() => {
    fetch("/api/lab/recent")
      .then(r => r.json())
      .then(d => { if (d.success) setResults(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => results.filter(r => {
    const matchSearch =
      r.testName?.toLowerCase().includes(search.toLowerCase()) ||
      r.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.patient?.mrn?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  }), [results, search, statusFilter]);

  const counts = {
    all:      results.length,
    pending:  results.filter(r => r.status === "pending").length,
    reviewed: results.filter(r => r.status === "reviewed").length,
  };

  return (
    <div className="min-h-screen bg-[#eef3fa] font-sans">
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="bg-white border-b border-blue-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 rounded-xl bg-[#eef3fa] flex items-center justify-center text-slate-600 shrink-0">
              <Menu size={18} />
            </button>
            <div className="flex-1 relative max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by test, patient, MRN…"
                className="w-full pl-9 pr-3 py-2 bg-[#eef3fa] border border-blue-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <button onClick={() => setShowFilter(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0
                ${showFilter ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-blue-100 hover:bg-[#eef3fa]"}`}>
              <Filter size={13} /> Filter <ChevronDown size={12} className={`transition-transform ${showFilter ? "rotate-180" : ""}`} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            {/* Filter bar */}
            {showFilter && (
              <div className="bg-white rounded-2xl border border-blue-100 p-4 mb-4 flex flex-wrap gap-2">
                {[
                  { key: "all",      label: `All (${counts.all})` },
                  { key: "pending",  label: `Pending (${counts.pending})` },
                  { key: "reviewed", label: `Reviewed (${counts.reviewed})` },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setStatusFilter(key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                      ${statusFilter === key ? "bg-[#003a66] text-white" : "bg-[#eef3fa] text-slate-600 hover:bg-blue-100"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Page title */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-base font-black text-slate-800">Recent Uploads</h1>
                <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>
              </div>
              <Link href="/lab/upload">
                <button className="flex items-center gap-1.5 bg-[#003a66] hover:bg-[#004f8c] text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-all shrink-0">
                  <FlaskConical size={13} /> New Upload
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-blue-50 animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-blue-200 p-16 text-center">
                <ClipboardCheck size={28} className="text-blue-100 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No results found</p>
                <p className="text-xs text-slate-300 mt-1">Try a different search or filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item, i) => {
                  const st = STATUS_MAP[item.status] ?? STATUS_MAP.default;
                  const StatusIcon = st.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-blue-50 p-4 sm:p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <FlaskConical size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <p className="text-sm font-black text-slate-800 truncate">{item.testName}</p>
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {item.patient?.name ?? "Unknown"} · <span className="font-mono">{item.patient?.mrn ?? "—"}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-xs font-black text-blue-700">{item.resultValue}</p>
                        {item.createdAt && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}