import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { ResultTable } from "@/components/result-table";
import { mockLabResults, mockPatientRecordsSummary } from "@/lib/mock-data";
import { Shield, ClipboardList, Filter, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LabResultsPage() {
  return (
    <div>
      <Header title="Lab Results" />

      <div className="p-6 space-y-6">
        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Records Summary */}
          <DashboardCard className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Patient Records Summary
            </h2>
            <p className="text-muted-foreground mb-6">
              Access and download your official laboratory reports. These results
              are verified by Alatyon Hospital diagnostic specialists.
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Last Update
                </p>
                <p className="font-semibold text-foreground">
                  {mockPatientRecordsSummary.lastUpdate}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Verified By
                </p>
                <p className="font-semibold text-foreground">
                  {mockPatientRecordsSummary.verifiedBy}
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* Health Status Card */}
          <DashboardCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Health Status
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-600 mb-2">
              {mockPatientRecordsSummary.healthStatus}
            </p>
            <p className="text-sm text-muted-foreground">
              {mockPatientRecordsSummary.healthStatusDescription}
            </p>
          </DashboardCard>
        </div>

        {/* Results Table Section */}
        <DashboardCard className="overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                Verified Results
              </h3>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <ResultTable results={mockLabResults} />
        </DashboardCard>

        {/* Medical Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Medical Disclaimer:</span> These results
            are for informational purposes. Always consult with your healthcare
            provider to interpret laboratory results in the context of your overall
            health and clinical presentation.
          </p>
        </div>
      </div>
    </div>
  );
}
