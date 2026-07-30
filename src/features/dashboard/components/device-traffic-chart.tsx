"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { name: "desktop", value: 45, color: "var(--color-primary)" },
  { name: "mobile", value: 35, color: "var(--color-accent)" },
  { name: "tablet", value: 15, color: "var(--color-muted-foreground)" },
  { name: "other", value: 5, color: "var(--color-border)" },
];

const chartConfig = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
  other: "Other",
};

export function DeviceTrafficChart() {
  const dominantDevice = chartData.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-semibold">Device Traffic</h3>
        <span className="text-muted-foreground text-sm">Current period</span>
      </div>
      <div className="relative">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="border-border bg-popover rounded-lg border px-3 py-2 text-sm shadow-md">
                        <p className="text-popover-foreground font-medium capitalize">
                          {payload[0].payload.name}
                        </p>
                        <p className="text-muted-foreground">{payload[0].value}% traffic</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-foreground text-3xl font-bold">{dominantDevice.value}%</span>
          <span className="text-muted-foreground text-xs capitalize">
            {chartConfig[dominantDevice.name as keyof typeof chartConfig]}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground text-xs capitalize">
              {chartConfig[item.name as keyof typeof chartConfig]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
