"use client";
import { useState } from "react";
import { Beaker, PlusCircle, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LabDashboard() {
  const [testData, setTestData] = useState({ patientId: "", testName: "", result: "" });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 space-y-8">
        <h2 className="text-xl font-bold italic text-cyan-400">Alatyon Lab</h2>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg cursor-pointer">
            <PlusCircle size={20} /> <span>Add Result</span>
          </div>
          <div className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
            <ClipboardList size={20} /> <span>Recent Tests</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800">Lab Technician Dashboard</h1>
          <Button variant="outline" onClick={() => window.location.href = '/admin/login'}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Beaker className="text-primary" /> Enter New Test Result
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Patient ID (MRN)</label>
              <Input placeholder="e.g. MRN-001" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Test Name</label>
                <Input placeholder="e.g. Glucose" />
              </div>
              <div>
                <label className="text-sm font-medium">Value</label>
                <Input placeholder="e.g. 110 mg/dL" />
              </div>
            </div>
            <Button className="w-full mt-4">Submit to Doctor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}