"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// ❌ Header ተወግዷል (በ Layout ውስጥ ስላለ)
import { DashboardCard, MetricCard } from "@/components/dashboard-card";
import {
  Heart,
  Calendar,
  ClipboardList,
  Download,
  Droplet,
  TestTube,
  Activity,
  User,
  BrainCircuit,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function ResultIcon({ type }) {
  const lowerName = type?.toLowerCase() || "";
  if (lowerName.includes("blood")) return <Droplet className="h-5 w-5 text-red-500" />;
  if (lowerName.includes("glucose") || lowerName.includes("sugar")) return <Activity className="h-5 w-5 text-orange-500" />;
  return <TestTube className="h-5 w-5 text-blue-500" />;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState({ name: "", mrn: "", results: [] });
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/50 min-h-screen flex flex-col">
      {/* ❌ <Header /> ተወግዷል - አሁን አይደገምም */}

      <main className="p-6 space-y-8 max-w-7xl mx-auto flex-1 w-full">
        
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
              {getGreeting()}, {data.name}! 
            </h1>
            <p className="text-lg text-[#004a7c] font-medium opacity-90">
              Your Medical ID: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{data.mrn}</span>
            </p>
          </div>

          <DashboardCard className="flex items-center gap-4 bg-white border-none shadow-sm py-4 px-6">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100 animate-pulse">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Health Status</p>
              <p className="text-xl font-black text-slate-700">Healthy</p>
            </div>
          </DashboardCard>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="Total Tests" 
            value={data.results.length} 
            icon={<ClipboardList />} 
          />
          <MetricCard 
            label="Completed" 
            value={data.results.filter(r => r.status === "Completed").length} 
            icon={<Activity />}
          />
          <MetricCard 
            label="Latest Visit" 
            value={data.results[0] ? new Date(data.results[0].createdAt).toLocaleDateString() : "N/A"} 
            icon={<Calendar />}
            variant="highlight" 
          />
          <MetricCard 
            label="Patient ID" 
            value={data.mrn} 
            icon={<User />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Result History */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Result History</h2>
            <div className="grid gap-3">
              {data.results.length > 0 ? (
                data.results.map((result) => (
                  <div 
                    key={result.id} 
                    onClick={() => setSelectedResult(result)}
                    className="cursor-pointer"
                  >
                    <DashboardCard className={`group transition-all p-4 bg-white ${selectedResult?.id === result.id ? 'border-blue-500 ring-2 ring-blue-50' : 'hover:shadow-md border-none'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ResultIcon type={result.testName} />
                          <div>
                            <p className="font-bold text-slate-700 group-hover:text-[#004a7c]">
                              {result.testName}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {new Date(result.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${result.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {result.status}
                          </span>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
                            <Download size={18}/>
                          </Button>
                        </div>
                      </div>
                    </DashboardCard>
                  </div>
                ))
              ) : (
                <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-100 text-center">
                  <p className="text-slate-400 font-bold text-sm">No results available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Insight Panel */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">AI Health Insight</h2>
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                <BrainCircuit className="h-6 w-6" />
                <span className="font-bold tracking-tight">Gemini AI Analysis</span>
              </div>

              {selectedResult ? (
                selectedResult.status === "Completed" ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Measured Value</p>
                      <p className="text-2xl font-black text-[#004a7c]">{selectedResult.testValue} {selectedResult.unit}</p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-700 leading-relaxed">
                      <strong className="block text-blue-800 mb-1">Interpretation:</strong>
                      {selectedResult.interpretation || "Our AI is currently processing this laboratory result to give you a simple explanation."}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">This test is still in progress. AI analysis will be generated once results are released.</p>
                )
              ) : (
                <div className="text-center py-10">
                  <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium px-4">Select a specific result from the list to see an AI-powered health explanation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}