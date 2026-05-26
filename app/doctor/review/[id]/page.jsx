"use client";
import { use, useState, useEffect } from "react";
import {
  Brain, CheckCircle, Loader2, ArrowLeft,
  FlaskConical, FileText, AlertCircle, XCircle,
  Stethoscope, TrendingUp, Calendar, Hash,
  ClipboardList, Sparkles, ChevronDown, Activity
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const STATUS_STYLE = {
  PENDING_DOCTOR: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   label: "Pending Review" },
  COMPLETED:      { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Approved"       },
  Verified:       { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Approved"       },
  REJECTED:       { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     label: "Rejected"       },
};
const getStatusStyle = (s) =>
  STATUS_STYLE[s] ?? { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: s ?? "Unknown" };

const SEVERITY_OPTIONS = [
  { value: "normal",   label: "Normal",   color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  { value: "elevated", label: "Elevated", color: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500"   },
  { value: "critical", label: "Critical", color: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500"     },
];

export default function ReviewPage({ params }) {
  const { id } = use(params);
  const router  = useRouter();

  const [data, setData]               = useState(null);
  const [loadError, setLoadError]     = useState("");
  const [aiText, setAiText]           = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving]       = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [doctorNote, setDoctorNote]   = useState("");
  const [severity, setSeverity]       = useState("normal");
  const [showReject, setShowReject]   = useState(false);
  const [rejectNote, setRejectNote]   = useState("");
  const [done, setDone]               = useState(false);
  const [actionError, setActionError] = useState("");
  const [showAllTests, setShowAllTests] = useState(false);

  useEffect(() => {
    fetch(`/api/lab/result/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        // ✅ FIX: API returns { success, data } — read d.data, not d
        const result = d?.data ?? d;
        setData(result);
        if (result?.doctorComment) setDoctorNote(result.doctorComment);
      })
      .catch(e => setLoadError(`Failed to load result (${e}). Please go back and try again.`));
  }, [id]);

  const runAI = async () => {
    setIsAnalyzing(true);
    setActionError("");
    try {
      const res  = await fetch(`/api/doctor/analyze/${id}`);
      const json = await res.json();
      if (json.analysis) setAiText(json.analysis);
      else setActionError("AI analysis failed. Please try again.");
    } catch {
      setActionError("Network error while running AI analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const approve = async () => {
    setIsSaving(true);
    setActionError("");
    try {
      const res = await fetch(`/api/doctor/approve/${id}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalComment: aiText, doctorNote, severity }),
      });
      if (res.ok) { setDone(true); setTimeout(() => router.push("/doctor"), 1800); }
      else { const d = await res.json(); setActionError(d.error || "Failed to approve."); }
    } catch { setActionError("Network error while approving."); }
    finally   { setIsSaving(false); }
  };

  const reject = async () => {
    if (!rejectNote.trim()) { setActionError("Please write a reason for rejection."); return; }
    setIsRejecting(true);
    setActionError("");
    try {
      const res = await fetch("/api/doctor/action", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId: id, action: "REJECT", doctorNote: rejectNote }),
      });
      if (res.ok) router.push("/doctor");
      else { const d = await res.json(); setActionError(d.error || "Failed to reject."); }
    } catch { setActionError("Network error while rejecting."); }
    finally   { setIsRejecting(false); }
  };

  // ── Loading / error states ──────────────────────────────────────────────────
  if (!data && !loadError) return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );
  if (loadError) return (
    <div className="min-h-screen bg-[#f0f6ff] flex flex-col items-center justify-center gap-3 p-6 text-center">
      <AlertCircle size={32} className="text-red-400" />
      <p className="text-slate-600 font-bold max-w-sm">{loadError}</p>
      <button onClick={() => router.back()} className="text-blue-500 text-sm font-bold hover:underline">← Go back</button>
    </div>
  );

  // ── Field helpers ───────────────────────────────────────────────────────────
  const testName    = data.testName    ?? data.testType   ?? "—";
  const testValue   = data.testValue   ?? data.value      ?? "—";
  const unit        = data.unit        ?? "";
  const patientName = data.patient?.name ?? "—";
  const patientMrn  = data.patient?.mrn  ?? "—";
  const createdAt   = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "—";

  const st = getStatusStyle(data.status);
  const isAlreadyReviewed = ["COMPLETED", "Verified", "REJECTED"].includes(data.status);

  const allTests     = data.patient?.labResults ?? [];
  const visibleTests = showAllTests ? allTests : allTests.slice(0, 5);
  const currentSev   = SEVERITY_OPTIONS.find(s => s.value === severity) ?? SEVERITY_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#f0f6ff] font-sans pb-10">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wide transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <span className={`inline-flex items-center text-[10px] font-black px-3 py-1.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
            {st.label}
          </span>
        </div>

        {/* Banners */}
        {done && (
          <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl font-bold text-sm">
            <CheckCircle size={18} /> Result approved and sent to patient. Redirecting…
          </div>
        )}
        {actionError && (
          <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl font-bold text-sm">
            <AlertCircle size={16} /> {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ══ LEFT ══════════════════════════════════════════════════════════ */}
          <div className="space-y-4">

            {/* Patient info card */}
            <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4">Patient Details</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-[#003a66] rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                  {patientName !== "—"
                    ? patientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                    : "PT"}
                </div>
                <div>
                  <p className="font-black text-slate-800">{patientName}</p>
                  <p className="text-blue-600 text-xs font-bold font-mono">MRN: {patientMrn}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Hash,       label: "Test",   value: testName },
                  { icon: TrendingUp, label: "Value",  value: unit ? `${testValue} ${unit}` : testValue },
                  { icon: Calendar,   label: "Date",   value: createdAt },
                  { icon: Activity,   label: "Status", value: st.label },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#f0f6ff] rounded-xl p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Icon size={10} className="text-blue-400" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">{label}</p>
                    </div>
                    <p className="text-xs font-black text-slate-700 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab result table */}
            <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-blue-50 flex items-center gap-2">
                <FlaskConical size={14} className="text-blue-600" />
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Lab Result</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#f7faff]">
                    <tr>
                      {["Test Name", "Value", "Unit", "Status"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-blue-50">
                      <td className="px-4 py-3 font-bold text-slate-700">{testName}</td>
                      <td className="px-4 py-3 font-black text-[#003a66] text-sm">{testValue}</td>
                      <td className="px-4 py-3 text-slate-400 font-medium">{unit || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Severity selector */}
            {!isAlreadyReviewed && (
              <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-blue-600" />
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Result Severity</p>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Classify this result. The patient will see this classification.
                </p>
                <div className="flex flex-col gap-2">
                  {SEVERITY_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => setSeverity(opt.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all text-left
                        ${severity === opt.value
                          ? `${opt.color} border-current shadow-sm`
                          : "border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-[#f0f6ff]"}`}>
                      <span className={`w-3 h-3 rounded-full shrink-0 ${severity === opt.value ? opt.dot : "bg-slate-200"}`} />
                      {opt.label}
                      {opt.value === "critical" && (
                        <span className="ml-auto text-[9px] font-black uppercase tracking-wide opacity-60">Urgent</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Patient history */}
            {allTests.length > 1 && (
              <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-blue-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={14} className="text-blue-600" />
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Patient History</p>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{allTests.length} tests</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#f7faff]">
                      <tr>
                        {["Test", "Value", "Date", "Status"].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                      {visibleTests.map((t, i) => {
                        const ts = getStatusStyle(t.status);
                        return (
                          <tr key={i} className={t.id === id ? "bg-blue-50" : "hover:bg-[#f7faff]"}>
                            <td className="px-3 py-2.5 font-bold text-slate-700 truncate max-w-[80px]">{t.testName ?? "—"}</td>
                            <td className="px-3 py-2.5 font-black text-[#003a66]">{t.testValue ?? "—"}</td>
                            <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">{new Date(t.createdAt).toLocaleDateString()}</td>
                            <td className="px-3 py-2.5">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap ${ts.bg} ${ts.text}`}>{ts.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {allTests.length > 5 && (
                  <button onClick={() => setShowAllTests(v => !v)}
                    className="w-full py-2.5 text-[10px] font-bold text-blue-500 hover:text-blue-700 flex items-center justify-center gap-1 border-t border-blue-50">
                    {showAllTests ? "Show less" : `Show ${allTests.length - 5} more`}
                    <ChevronDown size={12} className={`transition-transform ${showAllTests ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            )}

            {/* Doctor's note */}
            <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope size={14} className="text-[#003a66]" />
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Doctor's Note</p>
              </div>
              <Textarea
                placeholder="Write your clinical observation, diagnosis, or advice for this patient…"
                value={doctorNote}
                onChange={e => setDoctorNote(e.target.value)}
                disabled={isAlreadyReviewed}
                className="min-h-[110px] rounded-xl bg-[#f0f6ff] border-blue-100 text-sm font-medium resize-none focus-visible:ring-blue-300 disabled:opacity-60"
              />
            </div>

            {/* Reject */}
            {!isAlreadyReviewed && (
              <>
                <button onClick={() => setShowReject(v => !v)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-red-200 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all">
                  <XCircle size={14} /> {showReject ? "Cancel" : "Reject This Result"}
                </button>
                {showReject && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-black text-red-600 uppercase tracking-wide">Reason for rejection</p>
                    <Textarea
                      placeholder="Explain why — the lab tech will see this message…"
                      value={rejectNote}
                      onChange={e => setRejectNote(e.target.value)}
                      className="min-h-[80px] rounded-xl bg-white border-red-200 text-sm resize-none focus-visible:ring-red-300"
                    />
                    <button onClick={reject} disabled={isRejecting}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all">
                      {isRejecting ? <Loader2 className="animate-spin" size={13} /> : <><XCircle size={13} /> Confirm Rejection</>}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ══ RIGHT (AI panel) ══════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-blue-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Brain size={17} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">AI Diagnostic Summary</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Powered by Gemini AI · Review before approving</p>
                  </div>
                </div>
                {!isAlreadyReviewed && (
                  <button onClick={runAI} disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 shadow-md shadow-blue-900/20 shrink-0">
                    {isAnalyzing
                      ? <><Loader2 className="animate-spin" size={13} /> Analyzing…</>
                      : <><Sparkles size={13} /> Generate Analysis</>}
                  </button>
                )}
              </div>

              {/* Empty state */}
              {!aiText && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-blue-100 rounded-2xl">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <FileText size={24} className="text-blue-300" />
                  </div>
                  <p className="text-slate-500 font-bold text-sm">No AI analysis yet</p>
                  <p className="text-slate-400 text-xs mt-1 max-w-xs">Click "Generate Analysis" to get an AI-powered diagnostic summary.</p>
                </div>
              )}

              {/* Loading */}
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-blue-100 rounded-2xl">
                  <Loader2 className="animate-spin text-blue-500 mb-4" size={28} />
                  <p className="text-slate-500 font-bold text-sm">Analyzing lab result…</p>
                  <p className="text-slate-400 text-xs mt-1">Gemini AI is reviewing the data</p>
                </div>
              )}

              {/* AI result */}
              {aiText && !isAnalyzing && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles size={12} className="text-purple-500" />
                      <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest">AI Generated — Edit if needed before approving</p>
                    </div>
                    <Textarea
                      value={aiText}
                      onChange={e => setAiText(e.target.value)}
                      disabled={isAlreadyReviewed}
                      className="min-h-[300px] rounded-xl bg-[#f0f6ff] border-blue-100 text-sm font-medium leading-relaxed resize-none focus-visible:ring-blue-300"
                    />
                  </div>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 font-medium">
                      AI analysis is a clinical decision-support tool. Always apply your own medical judgment. The patient will see this analysis.
                    </p>
                  </div>
                  {!isAlreadyReviewed && (
                    <button onClick={approve} disabled={isSaving || done}
                      className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10">
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Approve & Send to Patient</>}
                    </button>
                  )}
                </div>
              )}

              {/* Already reviewed — show stored interpretation */}
              {isAlreadyReviewed && data?.interpretation && !aiText && (
                <div className="space-y-4">
                  <div className="bg-[#f0f6ff] rounded-xl p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Stored Analysis</p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.interpretation}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold ${st.bg} ${st.text} ${st.border}`}>
                    <CheckCircle size={16} />
                    This result has already been {st.label.toLowerCase()} and sent to the patient.
                  </div>
                </div>
              )}
            </div>

            {/* Approve without AI */}
            {!isAlreadyReviewed && !aiText && !isAnalyzing && (
              <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-sm">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Approve Without AI</p>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Approve using only your doctor's note, without generating an AI analysis.
                </p>
                <button onClick={approve} disabled={isSaving || done || !doctorNote.trim()}
                  className="w-full py-3.5 bg-[#003a66] hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all">
                  {isSaving ? <Loader2 className="animate-spin" size={14} /> : <><CheckCircle size={14} /> Approve with Note Only</>}
                </button>
                {!doctorNote.trim() && (
                  <p className="text-[10px] text-slate-400 text-center mt-2">Add a doctor's note above to enable this</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}