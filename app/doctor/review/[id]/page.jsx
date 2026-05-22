"use client";
import { use, useState, useEffect } from "react";
import {
  Brain, CheckCircle, Loader2, ArrowLeft, Beaker,
  User2, FlaskConical, FileText, AlertCircle, XCircle
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function ReviewPage({ params }) {
  const { id } = use(params);
  const router  = useRouter();
  const [data, setData]             = useState(null);
  const [aiText, setAiText]         = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving]     = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [doctorNote, setDoctorNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [done, setDone]             = useState(false);

  useEffect(() => {
    fetch(`/api/lab/result/${id}`)
      .then(r => r.json())
      .then(setData);
  }, [id]);

  const runAI = async () => {
    setIsAnalyzing(true);
    try {
      const res  = await fetch(`/api/doctor/analyze/${id}`);
      const json = await res.json();
      setAiText(json.analysis ?? "");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const approve = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/doctor/approve/${id}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ finalComment: aiText, doctorNote }),
      });
      setDone(true);
      setTimeout(() => router.push("/doctor"), 1500);
    } finally {
      setIsSaving(false);
    }
  };

  const reject = async () => {
    setIsRejecting(true);
    try {
      await fetch("/api/doctor/action", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ resultId: id, action: "REJECT", doctorNote: rejectNote }),
      });
      router.push("/doctor");
    } finally {
      setIsRejecting(false);
    }
  };

  if (!data) return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f6ff] font-sans">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8">

        {/* Back */}
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wide mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {/* Success banner */}
        {done && (
          <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl font-bold text-sm">
            <CheckCircle size={18} /> Result approved and sent to patient.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* ── Patient card ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4">Patient Details</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <User2 size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{data?.patient?.name ?? "—"}</p>
                  <p className="text-blue-600 text-xs font-bold font-mono">MRN: {data?.patient?.mrn ?? "—"}</p>
                </div>
              </div>
              <hr className="border-blue-50 mb-4" />
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-3">Test Data</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <FlaskConical size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">{data?.testType ?? data?.testName}</p>
                  <p className="text-2xl font-black text-[#003a66]">{data?.value ?? data?.resultValue}</p>
                </div>
              </div>
            </div>

            {/* Doctor note */}
            <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-3">Doctor's Note</p>
              <Textarea
                placeholder="Add your clinical note here…"
                value={doctorNote}
                onChange={e => setDoctorNote(e.target.value)}
                className="min-h-[100px] rounded-xl bg-[#f0f6ff] border-blue-100 text-sm font-medium resize-none focus-visible:ring-blue-300"
              />
            </div>

            {/* Reject */}
            <button onClick={() => setShowReject(v => !v)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-red-200 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all">
              <XCircle size={15} /> Reject Result
            </button>
            {showReject && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-black text-red-600 uppercase tracking-wide">Reason for rejection</p>
                <Textarea placeholder="Explain why this result is being rejected…"
                  value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                  className="min-h-[80px] rounded-xl bg-white border-red-200 text-sm resize-none focus-visible:ring-red-300" />
                <button onClick={reject} disabled={isRejecting}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all">
                  {isRejecting ? <Loader2 className="animate-spin" size={14} /> : "Confirm Rejection"}
                </button>
              </div>
            )}
          </div>

          {/* ── AI panel ── */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-blue-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Brain size={16} className="text-blue-600" />
                  </div>
                  <p className="font-black text-slate-800 text-sm uppercase tracking-wide">AI Diagnostic Summary</p>
                </div>
                <button onClick={runAI} disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-black uppercase px-4 py-2 rounded-xl transition-all disabled:opacity-60">
                  {isAnalyzing ? <><Loader2 className="animate-spin" size={13} /> Analyzing…</> : <><Brain size={13} /> Generate</>}
                </button>
              </div>

              {!aiText && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <FileText size={24} className="text-blue-300" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">No analysis yet</p>
                  <p className="text-slate-300 text-xs mt-1">Click "Generate" to run the AI analysis</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="animate-spin text-blue-500 mb-3" size={28} />
                  <p className="text-slate-400 font-bold text-sm">Analyzing lab result…</p>
                </div>
              )}

              {aiText && !isAnalyzing && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <Textarea
                    value={aiText}
                    onChange={e => setAiText(e.target.value)}
                    className="min-h-[260px] rounded-xl bg-[#f0f6ff] border-blue-100 text-sm font-medium leading-relaxed resize-none focus-visible:ring-blue-300"
                  />
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 font-medium">AI analysis is a decision-support tool. Always apply clinical judgment before approving.</p>
                  </div>
                  <button onClick={approve} disabled={isSaving || done}
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Approve & Send to Patient</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}