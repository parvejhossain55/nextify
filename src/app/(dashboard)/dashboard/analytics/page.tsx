import { Card, CardContent } from "@/components/ui/card";
import { WorkspaceAnalyticsChart } from "@/features/dashboard/components/workspace-analytics-chart";
import { DeviceTrafficChart } from "@/features/dashboard/components/device-traffic-chart";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Detailed insights into your workspace performance and user engagement.
          </p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <WorkspaceAnalyticsChart />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-6">
            <DeviceTrafficChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
