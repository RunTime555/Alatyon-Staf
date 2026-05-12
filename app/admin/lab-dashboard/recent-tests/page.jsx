"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, FileText, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecentTestsPage() {
  // ለጊዜው በ Mock Data (ዳታቤዝ ስንቀጥል ይሄ በ Fetch ይተካል)
  const [tests] = useState([
    { id: "MRN-001", name: "Abebe Kebede", test: "Glucose", date: "2026-05-10", status: "Sent" },
    { id: "MRN-005", name: "Sara Belay", test: "HGB", date: "2026-05-11", status: "Pending" },
    { id: "MRN-012", name: "Chala Buna", test: "Creatinine", date: "2026-05-12", status: "Sent" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/lab-dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Recent Lab Tests</h1>
          </div>
          <Button className="bg-primary text-white">Export to PDF</Button>
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input className="pl-10" placeholder="Search by MRN or Patient Name..." />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4 font-semibold">Patient ID</th>
                <th className="p-4 font-semibold">Full Name</th>
                <th className="p-4 font-semibold">Test Type</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.map((test, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-primary">{test.id}</td>
                  <td className="p-4">{test.name}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" /> {test.test}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{test.date}</td>
                  <td className="p-4">
                    {test.status === "Sent" ? (
                      <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold w-fit">
                        <CheckCircle2 className="h-3 w-3" /> SENT
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold w-fit">
                        <Clock className="h-3 w-3" /> PENDING
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}