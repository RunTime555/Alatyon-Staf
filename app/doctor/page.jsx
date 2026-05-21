"use client";
import { useState, useEffect } from "react";
import {
  Brain, Beaker, ChevronRight, Loader2, LayoutDashboard,
  ClipboardList, Users, Settings, LogOut, Bell, Search,
  TrendingUp, CheckCircle2, Clock3, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/doctor", active: true },
  { icon: ClipboardList,   label: "Pending Reviews", href: "/doctor/pending", badge: null },
  { icon: Users,           label: "Patients", href: "/doctor/patients" },
  { icon: Brain,           label: "AI Reports", href: "/doctor/reports" },
  { icon: Settings,        label: "Settings", href: "/doctor/settings" },
];

const STATUS_COLORS = {
  critical:  { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500",    label: "Critical" },
  elevated:  { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-500",  label: "Elevated" },
  normal:    { bg: "bg-emerald-50",text: "text-emerald-600",dot: "bg-emerald-500",label: "Normal" },
};

function getStatus(item) {
  if (item.status) return item.status;
  return "elevated";
}

export default function DoctorDashboard() {
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [sidebarOpen, setSidebar] = useState(true);

  useEffect(() => {
    fetch("/api/doctor/pending")
      .then(res => res.json())
      .then(data => { setResults(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = results.filter(r =>
    !search ||
    r.testType?.toLowerCase().includes(search.toLowerCase()) ||
    r.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Pending Reviews", value: results.length, icon: Clock3,      color: "text-blue-600",    bg: "bg-blue-50" },
    { label: "Reviewed Today",  value: 0,              icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Critical Cases",  value: results.filter(r => getStatus(r) === "critical").length, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "AI Analyses",     value: 0,              icon: TrendingUp,   color: "text-purple-600",  bg: "bg-purple-50" },
  ];

  return (
    <div className="flex h-screen bg-[#f0f4f8] font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-60" : "w-[68px]"} transition-all duration-300 bg-[#0a1628] flex flex-col shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <Beaker size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-black text-sm leading-none">Alatyon</p>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Lab System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, href, active, badge }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                ${active
                  ? "bg-blue-600 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-semibold flex-1">{label}</span>
              )}
              {sidebarOpen && badge != null && (
                <span className="bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">DR</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">Dr. User</p>
                <p className="text-white/40 text-[10px]">Physician</p>
              </div>
              <LogOut size={14} className="text-white/30 hover:text-white cursor-pointer" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-black">DR</div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebar(v => !v)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
            <LayoutDashboard size={16} />
          </button>

          <div className="flex-1 relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patients or tests…"
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
              <Bell size={16} />
              {results.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pending Lab Reviews</h1>
            <p className="text-slate-400 text-sm mt-0.5">Review and approve AI-assisted lab result analyses</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                  <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={15} className={color} />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Results list */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={28} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-bold text-sm">
                {search ? "No results match your search." : "No pending results to review."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const st = STATUS_COLORS[getStatus(item)] ?? STATUS_COLORS.elevated;
                return (
                  <div key={item.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition-all group">

                    {/* Icon */}
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <Beaker size={20} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide truncate">{item.testType}</h3>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold truncate">
                        {item.patient?.name ?? "Unknown patient"}
                        <span className="mx-1.5 text-slate-300">·</span>
                        MRN: {item.patient?.mrn ?? "—"}
                      </p>
                    </div>

                    {/* Time */}
                    {item.createdAt && (
                      <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs font-semibold shrink-0">
                        <Clock3 size={12} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Action */}
                    <Link href={`/doctor/review/${item.id}`} className="shrink-0">
                      <Button className="bg-[#0a1628] hover:bg-[#1a2f50] text-white rounded-xl font-bold text-xs uppercase gap-2 h-9 px-4 transition-all group-hover:bg-blue-600">
                        Review <ChevronRight size={13} />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}