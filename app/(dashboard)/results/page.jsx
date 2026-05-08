"use client";

import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { ResultTable } from "@/components/result-table";
import { mockLabResults, mockPatientRecordsSummary } from "@/lib/mock-data";
import { Shield, ClipboardList, Filter, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LabResultsPage() {
  return (
    <div className="w-full bg-slate-50/50 min-h-screen">
      {/* ገጹ ሲከፈት ርዕሱን ለ Header እንሰጠዋለን */}
      <Header title="Lab Results" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Patient Records Summary - Added brand accent */}
          <DashboardCard className="lg:col-span-2 border-l-4 border-l-[#004a7c] bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Patient Records Summary
                </h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Access and download your official laboratory reports. These results
                  are verified by <span className="font-semibold text-[#004a7c]">Alatyon Hospital</span> diagnostic specialists.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:gap-12 gap-4 mt-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">
                  Last Update
                </p>
                <p className="font-bold text-slate-700">
                  {mockPatientRecordsSummary.lastUpdate}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">
                  Verified By
                </p>
                <p className="font-bold text-slate-700">
                  {mockPatientRecordsSummary.verifiedBy}
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* Health Status Card - Enhanced visual */}
          <DashboardCard className="bg-white flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                Current Health Status
              </span>
            </div>
            <p className="text-4xl font-black text-emerald-600 mb-1">
              {mockPatientRecordsSummary.healthStatus}
            </p>
            <p className="text-xs font-medium text-slate-400">
              {mockPatientRecordsSummary.healthStatusDescription}
            </p>
          </DashboardCard>
        </div>

        {/* Results Table Section */}
        <DashboardCard className="p-0 overflow-hidden border-none shadow-sm bg-white">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-[#004a7c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Verified Results
                </h3>
                <p className="text-xs text-slate-500">Your recent laboratory investigations</p>
              </div>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="gap-2 border-slate-200 text-slate-600">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button size="sm" className="gap-2 bg-[#004a7c] hover:bg-[#003a63]">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>

          {/* Table Container for Responsiveness */}
          <div className="overflow-x-auto">
            <ResultTable results={mockLabResults} />
          </div>
        </DashboardCard>

        {/* Medical Disclaimer - Improved styling */}
        <div className="flex items-start gap-3 p-5 rounded-xl bg-blue-50/50 border border-blue-100/50">
          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="h-4 w-4 text-[#004a7c]" />
          </div>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-[#004a7c]">Medical Disclaimer:</span> These results
            are for informational purposes. Always consult with your healthcare
            provider to interpret laboratory results in the context of your overall
            health and clinical presentation.
          </p>
        </div>
      </div>
    </div>
  );
}