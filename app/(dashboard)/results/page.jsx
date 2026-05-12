"use client";

import { useState } from "react";
import { DashboardCard } from "@/components/dashboard-card";
import { ResultTable } from "@/components/result-table";
import { mockLabResults, mockPatientRecordsSummary } from "@/lib/mock-data";
import { Shield, ClipboardList, Filter, Info, Printer, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LabResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // 1. ዶክተር ያረጋገጣቸው ውጤቶች ብቻ እንዲለዩ
  const verifiedOnly = mockLabResults.filter(r => r.status === "Verified" || r.isVerified === true);

  // 2. በፍለጋው መሰረት ውጤቶችን መለየት
  const filteredResults = verifiedOnly.filter((result) =>
    result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.id.includes(searchTerm)
  );

  return (
    <div className="w-full bg-slate-50/50 min-h-screen pb-10">
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Patient Records Summary Card */}
          <DashboardCard className="lg:col-span-2 border-l-4 border-l-[#004a7c] bg-white shadow-sm print:border-slate-200 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <CheckCircle2 className="h-4 w-4 text-[#004a7c]" />
                 <h2 className="text-xl font-black text-slate-800 tracking-tight">
                   Patient Records Summary
                 </h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Access and print your official laboratory reports verified by 
                <span className="font-bold text-[#004a7c] ml-1">Alatyon Hospital</span> specialists.
              </p>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 border-t border-slate-50 pt-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Last Update</p>
                <p className="font-bold text-slate-700 text-sm">{mockPatientRecordsSummary.lastUpdate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Verified Reports</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-black text-[#004a7c]">{verifiedOnly.length}</p>
                  <span className="text-[10px] text-slate-400 font-bold">Files</span>
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Pending Analysis</p>
                <p className="font-bold text-amber-600 text-sm">
                  {mockLabResults.length - verifiedOnly.length} Reports
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* Health Status Card */}
          <DashboardCard className="bg-white flex flex-col justify-center shadow-sm border-none relative overflow-hidden h-full min-h-[180px]">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Status</span>
              </div>
              <p className="text-4xl font-black text-emerald-600 mb-1 tracking-tighter">
                {mockPatientRecordsSummary.healthStatus}
              </p>
              <p className="text-xs font-bold text-slate-400 leading-tight">
                {mockPatientRecordsSummary.healthStatusDescription}
              </p>
            </div>
            {/* Background Decoration */}
            <Shield className="absolute -bottom-4 -right-4 h-24 w-24 text-emerald-50/50 rotate-12" />
          </DashboardCard>
        </div>

        {/* Results Table Section */}
        <DashboardCard className="p-0 overflow-hidden border-none shadow-sm bg-white">
          <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-[#004a7c]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Verified Results</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Certified Laboratory Records</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by test name..." 
                  className="pl-9 h-10 w-full sm:w-64 border-slate-200 focus:border-[#004a7c]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 gap-2 font-bold border-slate-200"
                >
                  <Filter className="h-4 w-4" /> Filter
                </Button>
                <Button 
                  onClick={() => window.print()} 
                  size="sm" 
                  className="h-10 gap-2 bg-[#004a7c] hover:bg-[#003a63] font-bold shadow-sm"
                >
                  <Printer className="h-4 w-4" /> Print All
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredResults.length > 0 ? (
              <ResultTable results={filteredResults} />
            ) : (
              <div className="p-20 text-center text-slate-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">No verified results found</p>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Disclaimer Section */}
        <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#004a7c]/5 border border-[#004a7c]/10">
          <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <Info className="h-4 w-4 text-[#004a7c]" />
          </div>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
            <span className="font-black text-[#004a7c] uppercase tracking-tighter mr-2">Medical Disclaimer:</span> 
            These reports are generated after rigorous verification by Alatyon Hospital laboratory specialists. 
            Always consult with your primary healthcare provider to interpret these findings accurately.
          </p>
        </div>
      </div>
    </div>
  );
}