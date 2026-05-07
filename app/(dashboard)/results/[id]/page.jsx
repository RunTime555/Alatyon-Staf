import Link from "next/link";
import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { mockResultDetails } from "@/lib/mock-data";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function StatusBadge({ status }) {
  const statusStyles = {
    NORMAL: "bg-emerald-100 text-emerald-700 border-emerald-200",
    HIGH: "bg-red-100 text-red-700 border-red-200",
    LOW: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const StatusIcon = status === "HIGH" ? ArrowUp : status === "LOW" ? ArrowDown : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
        statusStyles[status] || statusStyles.NORMAL
      )}
    >
      {status}
      {StatusIcon && <StatusIcon className="h-3 w-3" />}
    </span>
  );
}

export default async function ResultDetailPage({ params }) {
  const { id } = await params;
  
  // In real app, fetch result details based on ID
  const result = mockResultDetails;

  return (
    <div>
      <Header />

      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Patients
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{result.patientName}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-primary font-medium">Lab Report #{id}</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Result Details
            </h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of metabolic and lipid parameters
              <br />
              collected on {result.dateOfCollection.split(" •")[0]}.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="space-y-4">
            {/* Patient Card */}
            <DashboardCard>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={result.patientName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {result.patientName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{result.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    Patient ID: {result.patientId}
                  </p>
                </div>
              </div>
            </DashboardCard>

            {/* Date of Collection */}
            <DashboardCard className="bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Date of Collection
              </p>
              <p className="font-semibold text-foreground">
                {result.dateOfCollection}
              </p>
            </DashboardCard>

            {/* Referring Physician */}
            <DashboardCard className="bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Referring Physician
              </p>
              <p className="font-semibold text-foreground">
                {result.referringPhysician}
              </p>
            </DashboardCard>

            {/* Verified Badge */}
            {result.isVerified && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Verified Result</span>
              </div>
            )}
          </div>

          {/* Right Column - Lipid Profile Table */}
          <DashboardCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Lipid Profile</h2>
              <span className="text-xs text-muted-foreground px-3 py-1 rounded-full border border-border">
                Panel ID: {result.panelId}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Test Description
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Result
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Reference Range
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.lipidProfile.map((test, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-2">
                        <p className="font-medium text-foreground">{test.name}</p>
                        <p className="text-xs text-muted-foreground">{test.method}</p>
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={cn(
                            "text-lg font-bold",
                            test.status === "HIGH" && "text-red-600",
                            test.status === "LOW" && "text-amber-600",
                            test.status === "NORMAL" && "text-primary"
                          )}
                        >
                          {test.result}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          {test.unit}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-muted-foreground">
                        {test.referenceRange}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <StatusBadge status={test.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clinical Interpretation */}
          <DashboardCard className="lg:col-span-2 bg-muted/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Clinical Interpretation
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {result.clinicalInterpretation}
            </p>
          </DashboardCard>

          {/* Health Trend & Next Action */}
          <div className="space-y-4">
            {/* Health Trend */}
            <DashboardCard>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Health Trend</h3>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {result.healthTrend.metric}
                </p>
                <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {result.healthTrend.change}
                </p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
              </div>
            </DashboardCard>

            {/* Next Action */}
            <DashboardCard className="bg-muted/50">
              <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">
                Next Action
              </p>
              <p className="font-semibold text-foreground mb-4">
                {result.nextAction.title}
              </p>
              <Button className="w-full bg-primary text-primary-foreground">
                {result.nextAction.buttonText}
              </Button>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
