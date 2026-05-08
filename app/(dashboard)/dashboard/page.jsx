"use client";

import Link from "next/link";
import { Header } from "@/components/header"; // ቅንፍ ተጨምሯል
import { DashboardCard, MetricCard } from "@/components/dashboard-card"; // ቅንፍ ተጨምሯል
import {
  mockPatient,
  mockHealthMetrics,
  mockNextCheckup,
  mockResultHistory,
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
    blood: <Droplet className="h-5 w-5" />,
    lipid: <TestTube className="h-5 w-5" />,
    glucose: <Activity className="h-5 w-5" />,
  };
  return (
    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
      {iconMap[type] || <ClipboardList className="h-5 w-5" />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="w-full">
      <Header title="Alatyon Hospital Patient Portal" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold">
              {getGreeting()}, {mockPatient.firstName}.
            </h1>
            <p className="text-xl lg:text-2xl text-primary font-semibold">
              Your health data is looking stable today.
            </p>
          </div>

          <DashboardCard className="flex items-center gap-4 min-w-[200px]">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
              <p className="text-3xl font-bold">
                {mockHealthMetrics.heartRate} <span className="text-sm font-normal">BPM</span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard>
             <p className="text-xs text-muted-foreground mb-2">Latest Lab Result</p>
             <p className="font-semibold">{mockHealthMetrics.latestLabResult.name}</p>
             <p className="text-3xl font-bold">{mockHealthMetrics.latestLabResult.value} {mockHealthMetrics.latestLabResult.unit}</p>
             <div className="mt-4 text-xs">Measured: {mockHealthMetrics.latestLabResult.date}</div>
          </DashboardCard>

          <MetricCard label="Total Tests" value={mockHealthMetrics.totalTests} icon={<ClipboardList />} />
          
          <DashboardCard variant="highlight">
             <p className="text-sm font-medium">Next Checkup</p>
             <p className="mt-2 text-xs opacity-90">{mockNextCheckup.doctor}</p>
             <div className="mt-4 flex items-center gap-2"><Calendar size={14}/> {mockNextCheckup.date}</div>
          </DashboardCard>

          <MetricCard label="Last Visit" value={mockHealthMetrics.lastVisitDate} icon={<Calendar />} />
        </div>

        {/* Result History Section */}
        <div className="space-y-4">
           <h2 className="text-xl font-semibold">Result History</h2>
           {mockResultHistory.map((result) => (
              <DashboardCard key={result.id} className="hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <ResultIcon type={result.icon} />
                       <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-sm text-muted-foreground">{result.date}</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="icon"><Download size={18}/></Button>
                 </div>
              </DashboardCard>
           ))}
        </div>
      </div>
    </div>
  );
}