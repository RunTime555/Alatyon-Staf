"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { mockResultDetails } from "@/lib/mock-data";
import { use } from "react";
import {
  Printer,
  Download,
  CheckCircle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  FileText,
  BarChart3,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Status Badge Component
function StatusBadge({ status }) {
  const statusStyles = {
    NORMAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
    HIGH: "bg-red-50 text-red-700 border-red-200",
    LOW: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const StatusIcon = status === "HIGH" ? ArrowUp : status === "LOW" ? ArrowDown : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-tighter",
        statusStyles[status] || statusStyles.NORMAL
      )}
    >
      {status}
      {StatusIcon && <StatusIcon className="h-3 w-3" />}
    </span>
  );
}

export default function ResultDetailPage({ params }) {
  // Next.js 15+ params handling
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  // Real app ቢሆን እዚህ ጋር id-ን ተጠቅመን ከ Database ዳታ እናመጣ ነበር
  const result = mockResultDetails;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen pb-12">
      <Header title="Report Detail" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Link href="/dashboard" className="hover:text-[#004a7c] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/results" className="hover:text-[#004a7c] transition-colors">
            Lab Results
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#004a7c]">Report #{id}</span>
        </nav>

        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
                {result.patientName}
              </h1>
              {result.isVerified && (
                <div className="bg-emerald-50 text-emerald-600 p-1 rounded-full" title="Verified">
                  <CheckCircle className="h-5 w-5 fill-emerald-50" />
                </div>
              )}
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" /> 
              Collected on {result.dateOfCollection.split(" •")[0]}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="flex-1 md:flex-none gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button 
              onClick={handlePrint} // ለጊዜው print እንዲያደርግ
              className="flex-1 md:flex-none gap-2 bg-[#004a7c] hover:bg-[#003a63] shadow-md shadow-blue-900/10"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Patient & Lab Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar: Patient & Doctor Info */}
          <div className="space-y-6">
            <DashboardCard className="bg-white border-none shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-slate-50 shadow-inner">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={result.patientName} />
                  <AvatarFallback className="bg-[#004a7c] text-white text-xl font-black">
                    {result.patientName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Patient ID</p>
                  <p className="font-bold text-slate-700">{result.patientId}</p>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-4 w-4 text-[#004a7c]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Physician</p>
                    <p className="font-bold text-slate-700 leading-tight">{result.referringPhysician}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-[#004a7c]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Lab Panel</p>
                    <p className="font-bold text-slate-700 leading-tight">#{result.panelId}</p>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="bg-[#004a7c] text-white border-none relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Doctor's Action</p>
                <p className="font-bold mb-4 text-sm leading-relaxed">{result.nextAction.title}</p>
                <Button className="w-full bg-white text-[#004a7c] hover:bg-blue-50 font-black shadow-xl border-none">
                  {result.nextAction.buttonText}
                </Button>
              </div>
              <BarChart3 className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5" />
            </DashboardCard>
          </div>

          {/* Right Main: Lab Results Table */}
          <DashboardCard className="lg:col-span-2 bg-white border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Lipid Profile Analysis</h2>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase border border-emerald-100">
                Final Report
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400">
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Test Parameter</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-center">Result</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Ref. Range</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {result.lipidProfile.map((test, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-5 px-6">
                        <p className="font-bold text-slate-700 group-hover:text-[#004a7c] transition-colors">{test.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{test.method}</p>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className={cn(
                            "text-lg font-black",
                            test.status === "HIGH" ? "text-red-600" : 
                            test.status === "LOW" ? "text-amber-600" : "text-[#004a7c]"
                          )}>
                            {test.result}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{test.unit}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {test.referenceRange}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <StatusBadge status={test.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>

        {/* Bottom Section: Interpretation & Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard className="lg:col-span-2 bg-white border-none shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#004a7c]" />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Clinical Interpretation</h3>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {result.clinicalInterpretation}
              </p>
            </div>
          </DashboardCard>

          <DashboardCard className="bg-white border-none shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800 tracking-tight">Health Trend</h3>
              <BarChart3 className="h-5 w-5 text-slate-300" />
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{result.healthTrend.metric}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-black">{result.healthTrend.change}</span>
                </div>
                <p className="text-xs text-slate-400 font-medium italic">vs Last Month</p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-slate-400">Stable Range</span>
                  <span className="text-[#004a7c]">Current: 75%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div className="h-full w-[75%] bg-gradient-to-r from-blue-400 to-[#004a7c] rounded-full shadow-inner" />
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}