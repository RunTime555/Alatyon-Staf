"use client";

import Sidebar from "@/components/sidebar"; // Sidebar ቀድሞ default ስላደረግነው እንዲህ ይቆይ
import { Header } from "@/components/header"; // Named import

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-64">
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}