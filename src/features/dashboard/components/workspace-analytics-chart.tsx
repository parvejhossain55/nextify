"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", sessions: 186 },
  { month: "Feb", sessions: 305 },
  { month: "Mar", sessions: 237 },
  { month: "Apr", sessions: 273 },
  { month: "May", sessions: 209 },
  { month: "Jun", sessions: 322 },
  { month: "Jul", sessions: 387 },
  { month: "Aug", sessions: 456 },
  { month: "Sep", sessions: 398 },
  { month: "Oct", sessions: 512 },
  { month: "Nov", sessions: 478 },
  { month: "Dec", sessions: 589 },
];

export function WorkspaceAnalyticsChart() {
  return (
    <div className="h-full w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-semibold">Workspace Analytics</h3>
        <span className="text-muted-foreground text-sm">Last 12 months</span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="border-border bg-popover rounded-lg border px-3 py-2 text-sm shadow-md">
                      <p className="text-popover-foreground font-medium">
                        {payload[0].payload.month}
                      </p>
                      <p className="text-muted-foreground">{payload[0].value} sessions</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
