"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Loader2, Trash2, Beaker, Activity, Search,
  Menu, X, PlusCircle, User2, AlertCircle, FlaskConical,
  ClipboardCheck, LayoutDashboard, LogOut, Settings,
  CheckCircle2, Clock3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/lab" },
  { icon: FlaskConical,    label: "Upload Results", href: "/lab/upload", active: true },
  { icon: ClipboardCheck,  label: "Recent Uploads", href: "/lab/recent" },
];

const TEST_TYPES = [
  "Complete Blood Count (CBC)", "Blood Glucose", "Lipid Profile",
  "Liver Function (LFT)", "Renal Function (RFT)", "Urinalysis",
  "Thyroid Function (TSH)", "Malaria Parasite (MP)", "H. Pylori", "Other"
];

const STATUS_MAP = {
  pending:  { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400",   label: "Pending" },
  reviewed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400", label: "Reviewed" },
  default:  { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400",    label: "Uploaded" },
};

export default function LabUploadPage() {
  const [loading, setLoading]             = useState(false);
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [recentOpen, setRecentOpen]       = useState(false);
  const [patientMrn, setPatientMrn]       = useState("");
  const [recentResults, setRecentResults] = useState([]);
  const [searchQuery, setSearchQuery]     = useState("");
  const [submitted, setSubmitted]         = useState(false);

  const [tests, setTests] = useState([
    { id: Date.now(), testName: "", customTestName: "", isOther: false, resultValue: "" }
  ]);

  const fetchRecentResults = async () => {
    try {
      const res  = await fetch("/api/lab/recent");
      const json = await res.json();
      if (json.success) setRecentResults(json.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRecentResults(); }, []);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const groupedResults = useMemo(() => {
    const groups = {};
    recentResults.forEach((result) => {
      const mrn = result.patient?.mrn || "N/A";
      if (!groups[mrn]) {
        groups[mrn] = { name: result.patient?.name || "Unknown", mrn, tests: [] };
      }
      groups[mrn].tests.push(result);
    });
    return Object.values(groups).filter(g =>
      g.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recentResults, searchQuery]);

  const addTestField = () =>
    setTests(prev => [...prev, { id: Date.now(), testName: "", customTestName: "", isOther: false, resultValue: "" }]);

  const removeTestField = (id) => {
    if (tests.length > 1) setTests(prev => prev.filter(t => t.id !== id));
  };

  const updateTest = (id, field, value) => {
    setTests(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (field === "testName") return { ...t, testName: value, isOther: value === "Other" };
      return { ...t, [field]: value };
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const finalResults = tests.map(t => ({
      testName:    t.isOther ? t.customTestName : t.testName,
      resultValue: t.resultValue,
    }));
    try {
      const res = await fetch("/api/lab/upload", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ patientMrn, results: finalResults }),
      });
      if (res.ok) {
        setPatientMrn("");
        setTests([{ id: Date.now(), testName: "", customTestName: "", isOther: false, resultValue: "" }]);
        await fetchRecentResults();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Shared recent-submissions list ─── */
  const RecentList = () => (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {groupedResults.length === 0 ? (
        <div className="text-center py-12">
          <FlaskConical size={28} className="text-blue-100 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-semibold">No submissions yet</p>
        </div>
      ) : (
        groupedResults.map(group => {
          const st = STATUS_MAP[group.tests[0]?.status] ?? STATUS_MAP.default;
          return (
            <div key={group.mrn}
              className="bg-[#f7faff] rounded-xl border border-blue-50 p-3 hover:border-blue-200 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-black text-slate-700">{group.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{group.mrn}</p>
                </div>
                <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>
              <div className="space-y-1">
                {group.tests.slice(0, 3).map((t, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg px-2 py-1 border border-blue-50">
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[55%]">{t.testName}</span>
                    <span className="text-[10px] font-black text-blue-600">{t.resultValue}</span>
                  </div>
                ))}
                {group.tests.length > 3 && (
                  <p className="text-[9px] text-slate-400 text-center pt-0.5">+{group.tests.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eef3fa] font-sans">

      {/* ── Mobile nav sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Mobile recent-results drawer overlay ── */}
      {recentOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setRecentOpen(false)} />
      )}

      <div className="flex h-screen overflow-hidden">

        {/* ══════════════ LEFT SIDEBAR (nav) ══════════════ */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#003a66] flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:shrink-0
        `}>
          {/* Logo */}
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
            {/* Close button visible only on mobile */}
            <button onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white/50 hover:text-white p-1">
              <X size={18} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 py-5 px-3 space-y-1">
            {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
              <a key={label} href={href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all
                  ${active
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-900/30"
                    : "text-white/50 hover:bg-white/10 hover:text-white"}`}>
                <Icon size={17} className="shrink-0" />
                {label}
              </a>
            ))}
          </nav>

          {/* Stats */}
          <div className="mx-3 mb-4 bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-[10px] font-black uppercase text-blue-300 tracking-widest mb-3">Today's Activity</p>
            <div className="space-y-2">
              {[
                { icon: FlaskConical, label: "Uploaded", value: recentResults.length, color: "text-blue-300" },
                { icon: Clock3,       label: "Pending",  value: recentResults.filter(r => r.status === "pending").length,  color: "text-amber-300" },
                { icon: CheckCircle2, label: "Reviewed", value: recentResults.filter(r => r.status === "reviewed").length, color: "text-emerald-300" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={13} className={color} />
                    <span className="text-xs text-white/60 font-medium">{label}</span>
                  </div>
                  <span className={`text-xs font-black ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User footer */}
          <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">LT</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">Lab Technician</p>
              <p className="text-white/40 text-[10px]">Alatyon Lab</p>
            </div>
            <LogOut size={14} className="text-white/30 hover:text-white cursor-pointer" />
          </div>
        </aside>

        {/* ══════════════ MAIN CONTENT ══════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Topbar ── */}
          <header className="bg-white border-b border-blue-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30 shrink-0">
            {/* Hamburger — opens nav sidebar */}
            <button onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-[#eef3fa] flex items-center justify-center text-slate-600 shrink-0">
              <Menu size={18} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-black text-slate-800 leading-none truncate">Upload Lab Results</h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 hidden sm:block">Enter patient MRN and test data below</p>
            </div>

            {/* Success toast */}
            {submitted && (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                <CheckCircle2 size={12} /> Synced!
              </div>
            )}

            {/* Recent results trigger — mobile/tablet only */}
            <button onClick={() => setRecentOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-[#eef3fa] flex items-center justify-center text-blue-600 shrink-0 relative">
              <Activity size={17} />
              {recentResults.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </header>

          {/* ── Scrollable body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Form scroll area */}
            <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="max-w-2xl mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Patient MRN */}
                  <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                    <Label className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-3 block">
                      Patient Identification
                    </Label>
                    <div className="relative">
                      <User2 size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                      <Input
                        placeholder="Enter Patient MRN…"
                        className="pl-10 h-12 rounded-xl bg-[#f0f6ff] border-blue-100 font-bold text-slate-700 focus-visible:ring-blue-300"
                        value={patientMrn}
                        onChange={e => setPatientMrn(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Test rows */}
                  <div className="space-y-4">
                    {tests.map((test, index) => (
                      <div key={test.id} className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">

                        {/* Row header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Test Record</p>
                          </div>
                          {tests.length > 1 && (
                            <button type="button" onClick={() => removeTestField(test.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all shrink-0">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Fields — stacked on mobile, side by side on sm+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Test Category</Label>
                            <Select onValueChange={v => updateTest(test.id, "testName", v)}>
                              <SelectTrigger className="h-12 rounded-xl bg-[#f0f6ff] border-blue-100 font-semibold text-slate-700 focus:ring-blue-300 w-full">
                                <SelectValue placeholder="Choose test type" />
                              </SelectTrigger>
                              <SelectContent>
                                {TEST_TYPES.map(t => (
                                  <SelectItem key={t} value={t} className="font-semibold">{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Result Value</Label>
                            <Input
                              placeholder="e.g. 5.4 mmol/L"
                              className="h-12 rounded-xl bg-[#f0f6ff] border-blue-100 font-bold text-blue-700 focus-visible:ring-blue-300"
                              onChange={e => updateTest(test.id, "resultValue", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {/* Custom test name */}
                        {test.isOther && (
                          <div className="mt-4">
                            <Label className="text-[10px] font-black text-blue-600 uppercase tracking-wide mb-1.5 block">
                              Specify test name
                            </Label>
                            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1">
                              <AlertCircle size={15} className="text-blue-400 shrink-0" />
                              <Input
                                placeholder="Type the custom test name…"
                                className="bg-transparent border-none focus-visible:ring-0 font-semibold text-slate-700 h-10 min-w-0"
                                onChange={e => updateTest(test.id, "customTestName", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add test */}
                  <button type="button" onClick={addTestField}
                    className="w-full h-13 py-4 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-blue-400 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all">
                    <PlusCircle size={17} /> Add Another Test
                  </button>

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="w-full py-5 bg-[#003a66] hover:bg-[#004f8c] disabled:opacity-60 text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20">
                    {loading
                      ? <><Loader2 className="animate-spin" size={18} /> Syncing…</>
                      : <><FlaskConical size={17} /> Confirm & Sync Results</>}
                  </button>
                </form>
              </div>
            </main>

            {/* ══════════════ RIGHT PANEL — desktop only ══════════════ */}
            <aside className="hidden lg:flex w-72 border-l border-blue-100 bg-white flex-col shrink-0">
              <div className="px-5 py-5 border-b border-blue-50 shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-blue-600" />
                  <h2 className="text-xs font-black uppercase text-slate-600 tracking-widest">Recent Submissions</h2>
                </div>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    placeholder="Search MRN or name…"
                    className="w-full pl-8 pr-3 py-2 bg-[#f0f6ff] rounded-xl text-xs font-medium border border-blue-100 outline-none focus:ring-2 focus:ring-blue-200"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <RecentList />
            </aside>
          </div>
        </div>
      </div>

      {/* ══════════════ MOBILE RECENT DRAWER (bottom sheet) ══════════════ */}
      <div className={`
        fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-blue-100 shadow-2xl
        transition-transform duration-300 ease-in-out lg:hidden
        ${recentOpen ? "translate-y-0" : "translate-y-full"}
      `} style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
        {/* Drawer handle & header */}
        <div className="px-5 pt-4 pb-4 border-b border-blue-50 shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-600" />
              <h2 className="text-xs font-black uppercase text-slate-600 tracking-widest">Recent Submissions</h2>
            </div>
            <button onClick={() => setRecentOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <X size={15} />
            </button>
          </div>
          <div className="relative mt-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="Search MRN or name…"
              className="w-full pl-8 pr-3 py-2.5 bg-[#f0f6ff] rounded-xl text-xs font-medium border border-blue-100 outline-none focus:ring-2 focus:ring-blue-200"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          <RecentList />
        </div>
      </div>
    </div>
  );
}