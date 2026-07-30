import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { UserProfile, UserList } from "@/features/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BarChart3,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const stats = [
    {
      label: "Total Users",
      value: "2,543",
      delta: "+12.5%",
      trend: "up" as const,
      icon: Users,
    },
    {
      label: "Active Sessions",
      value: "1,204",
      delta: "+4.2%",
      trend: "up" as const,
      icon: Activity,
    },
    {
      label: "Conversion",
      value: "3.24%",
      delta: "-0.8%",
      trend: "down" as const,
      icon: BarChart3,
    },
    {
      label: "Security Score",
      value: "98.2",
      delta: "+2.1",
      trend: "up" as const,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, {session.user.name?.split(" ")[0] ?? "User"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s what&apos;s happening with your workspace today.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <div
                className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${
                  s.trend === "up" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {s.trend === "up" ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {s.delta}
                <span className="text-muted-foreground ml-1 font-normal">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
