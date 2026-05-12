"use client";
import { User, Activity, FileText, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DoctorDashboard() {
  const pendingResults = [
    { id: 1, name: "Abebe Kebede", test: "HGB", value: "11.2 (Low)" },
    { id: 2, name: "Chala Buna", test: "Creatinine", value: "0.9 (Normal)" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white p-6 space-y-8">
        <h2 className="text-xl font-bold italic">Alatyon Doctor</h2>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg cursor-pointer">
            <Activity size={20} /> <span>Patient Results</span>
          </div>
          <div className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer">
            <FileText size={20} /> <span>Prescriptions</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input className="pl-10" placeholder="Search patient by MRN..." />
          </div>
          <Button variant="ghost" onClick={() => window.location.href = '/admin/login'}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        <h2 className="text-xl font-bold mb-6 text-slate-800">Pending Lab Results Review</h2>
        <div className="grid gap-4">
          {pendingResults.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-lg border border-slate-200 flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Test: {item.test}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary">{item.value}</p>
                <Button size="sm" variant="outline" className="mt-2">Review & Sign</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}