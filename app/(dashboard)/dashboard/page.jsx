"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { DashboardCard, MetricCard } from "@/components/dashboard-card";
import {
  mockPatient,
  mockHealthMetrics,
  mockNextCheckup,
  mockResultHistory, // ይህንን ዳታ ነው የምንጠቀመው
} from "@/lib/mock-data";
import {
  Heart,
  Calendar,
  ClipboardList,
  Download,
  ArrowRight,
  Droplet,
  TestTube,
  Activity,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function ResultIcon({ type }) {
  const iconMap = {
    blood: <Droplet className="h-5 w-5 text-red-500" />,
    lipid: <TestTube className="h-5 w-5 text-blue-500" />,
    glucose: <Activity className="h-5 w-5 text-orange-500" />,
  };
  return (
    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
      {iconMap[type] || <ClipboardList className="h-5 w-5 text-slate-400" />}
    </div>
  );
}

export default function DashboardPage() {
  // ሎጂኩን እዚህ ፋንክሽን ውስጥ እናስገባው
  // በ mock-data ውስጥ status: "Approved" የሆኑትን ብቻ እንለያለን
  const publishedResults = mockResultHistory.filter(r => r.status === "Approved" || r.status === "Verified");

  return (
    <div className="w-full bg-slate-50/50 min-h-screen flex flex-col">
      <Header title="Patient Dashboard" userType="patient" />

      <main className="p-6 space-y-8 max-w-7xl mx-auto flex-1 w-full">
        
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
              {getGreeting()}, {mockPatient.firstName}! 👋
            </h1>
            <p className="text-lg text-[#004a7c] font-medium opacity-90">
              Your health data is looking stable today.
            </p>
          </div>

          <DashboardCard className="flex items-center gap-4 bg-white border-none shadow-sm py-4">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100 animate-pulse">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Heart Rate</p>
              <p className="text-2xl font-black text-slate-700">
                {mockHealthMetrics.heartRate} <span className="text-xs font-medium text-slate-400">BPM</span>
              </p>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="Latest Lab Result" 
            value={`${mockHealthMetrics.latestLabResult.value} ${mockHealthMetrics.latestLabResult.unit}`}
            icon={<TestTube />}
          />
          <MetricCard 
            label="Total Tests" 
            value={mockHealthMetrics.totalTests} 
            icon={<ClipboardList />} 
          />
          <MetricCard 
            label="Next Checkup" 
            value={mockNextCheckup.date} 
            icon={<Calendar />}
            variant="highlight" 
          />
          <MetricCard 
            label="Last Visit" 
            value={mockHealthMetrics.lastVisitDate} 
            icon={<User />} 
          />
        </div>

        {/* Result History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Recent Result History</h2>
            <Link href="/results" className="text-sm font-bold text-[#004a7c] hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid gap-3">
            {/* ውጤት መኖሩን ቼክ እናደርጋለን */}
            {publishedResults.length > 0 ? (
              publishedResults.map((result) => (
                <Link key={result.id} href={`/results/${result.id}`}>
                  <DashboardCard className="group hover:border-[#004a7c]/30 hover:shadow-md transition-all p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <ResultIcon type={result.icon} />
                        <div>
                          <p className="font-bold text-slate-700 group-hover:text-[#004a7c] transition-colors">
                            {result.name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            Collected on {result.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="hidden sm:block text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded uppercase tracking-tighter">
                            {result.status}
                         </span>
                         <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#004a7c]">
                           <Download size={18}/>
                         </Button>
                      </div>
                    </div>
                  </DashboardCard>
                </Link>
              ))
            ) : (
              <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-100 text-center">
                <p className="text-slate-400 font-bold text-sm">
                  No approved results yet. Please check back later or contact the lab.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}