import Link from "next/link";
import { Header } from "@/components/header";
import { DashboardCard, MetricCard } from "@/components/dashboard-card";
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
    <div>
      <Header title="Alatyon Hospital Patient portal" />

      <div className="p-6 space-y-6">
        {/* Greeting Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {getGreeting()}, {mockPatient.firstName}.
            </h1>
            <p className="text-xl lg:text-2xl text-primary font-semibold">
              Your health data is
              <br />
              looking stable today.
            </p>
          </div>

          {/* Heart Rate Card */}
          <DashboardCard className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {mockHealthMetrics.heartRate}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  BPM
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
          </DashboardCard>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Latest Lab Result */}
          <DashboardCard className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                Latest Lab Result
              </span>
              <Download className="h-4 w-4 text-primary" />
            </div>
            <p className="font-semibold text-foreground mb-2">
              {mockHealthMetrics.latestLabResult.name}
            </p>
            <p className="text-4xl font-bold text-foreground">
              {mockHealthMetrics.latestLabResult.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {mockHealthMetrics.latestLabResult.unit}
              </span>
            </p>
            <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {mockHealthMetrics.latestLabResult.status}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Measured: {mockHealthMetrics.latestLabResult.date}</span>
              <Link
                href="/results"
                className="text-primary font-medium hover:underline flex items-center gap-1"
              >
                View Report <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </DashboardCard>

          {/* Total Tests */}
          <MetricCard
            label="Total Tests"
            value={mockHealthMetrics.totalTests}
            icon={<ClipboardList className="h-5 w-5" />}
          />

          {/* Next Wellness Checkup */}
          <DashboardCard
            variant="highlight"
            className="row-span-2 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-medium text-primary-foreground/80">
                {mockNextCheckup.title}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-primary-foreground/90">
                  {mockNextCheckup.doctor} at {mockNextCheckup.location}
                </p>
              </div>
            </div>
            <div className="mt-6 p-3 rounded-lg bg-primary-foreground/10">
              <p className="text-xs text-primary-foreground/70 mb-1">
                Date & Time
              </p>
              <div className="flex items-center gap-2 text-primary-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {mockNextCheckup.date}, {mockNextCheckup.time}
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Last Visit Date */}
          <DashboardCard>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                Last Visit Date
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {mockHealthMetrics.lastVisitDate}
            </p>
            <div className="mt-3">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </DashboardCard>
        </div>

        {/* Result History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Result History
            </h2>
            <Link
              href="/results"
              className="text-sm text-primary font-medium hover:underline"
            >
              Download All Records
            </Link>
          </div>

          <div className="space-y-3">
            {mockResultHistory.map((result) => (
              <Link
                key={result.id}
                href={`/results/${result.id}`}
                className="block"
              >
                <DashboardCard className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ResultIcon type={result.icon} />
                      <div>
                        <p className="font-medium text-foreground">
                          {result.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                          {result.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {result.date}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Download result"
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
