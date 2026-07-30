/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: Record<string, { label?: string; icon?: React.ComponentType; color?: string }>;
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef<
  typeof RechartsPrimitive.Tooltip,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip>
>(({ ...props }, ref) => {
  // Filter out Recharts internal props that shouldn't reach DOM

  const {
    allowEscapeViewBox,
    animationDuration,
    animationEasing,
    axisId,
    contentStyle,
    cursor,
    filterNull,
    includeHidden,
    isAnimationActive,
    itemSorter,
    itemStyle,
    labelStyle,
    reverseDirection,
    useTranslate3d,
    wrapperStyle,
    activeIndex,
    accessibilityLayer,
    ...tooltipProps
  } = props as any;

  return <RechartsPrimitive.Tooltip ref={ref} {...tooltipProps} />;
});
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: any[];
    className?: string;
    indicator?: "line" | "dot" | "dashed";
    labelKey?: string;
    labelFormatter?: (label: any) => React.ReactNode;
    formatter?: (value: any) => string;
    nameKey?: string;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      labelKey = "label",
      labelFormatter,
      formatter,
      nameKey,
      ...props
    },
    ref
  ) => {
    const [label, setLabel] = React.useState<string | React.ReactNode>("");
    const [formattedPayload, setFormattedPayload] = React.useState<
      Array<{ name: string; value: string; color: string }>
    >([]);

    // Filter out Recharts internal props

    const {
      allowEscapeViewBox,
      animationDuration,
      animationEasing,
      axisId,
      contentStyle,
      cursor,
      filterNull,
      includeHidden,
      isAnimationActive,
      itemSorter,
      itemStyle,
      labelStyle,
      reverseDirection,
      useTranslate3d,
      wrapperStyle,
      activeIndex,
      accessibilityLayer,
      ...domProps
    } = props as any;

    React.useEffect(() => {
      if (active && payload && payload.length) {
        const newLabel = labelFormatter
          ? labelFormatter(payload[0].payload[labelKey])
          : payload[0].payload[labelKey];
        setLabel(newLabel);

        const newFormattedPayload = payload.map((item: any) => ({
          name: nameKey ? item.payload[nameKey] : item.name,
          value: formatter ? formatter(item.value) : item.value,
          color: item.color,
        }));
        setFormattedPayload(newFormattedPayload);
      }
    }, [active, payload, labelFormatter, formatter, labelKey, nameKey]);

    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-popover border-border text-popover-foreground grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...domProps}
      >
        <div className="grid w-full items-center">
          <span className="text-muted-foreground">{label}</span>
        </div>
        <div className="grid gap-1.5">
          {formattedPayload.map((item, index) => (
            <div
              key={index}
              className="border-border/50 flex w-full items-center justify-between gap-2 border-b pb-1 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("h-2 w-2 shrink-0 rounded-[2px]", {
                    "bg-primary": indicator === "dot",
                    "h-0.5 w-3.5": indicator === "line",
                    "h-0.5 w-3.5 border-2 border-dashed": indicator === "dashed",
                  })}
                  style={{
                    backgroundColor: indicator === "dot" ? item.color : undefined,
                    borderColor: indicator !== "dot" ? item.color : undefined,
                  }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-mono font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: any[];
    className?: string;
    hideIcon?: boolean;
    nameKey?: string;
  }
>(({ className, hideIcon = false, payload, nameKey, ...props }, ref) => {
  if (!payload?.length) {
    return null;
  }

  return (
    <div ref={ref} className={cn("flex items-center justify-center gap-4", className)} {...props}>
      {payload.map((entry: any, index: number) => {
        const label = nameKey ? entry.payload[nameKey] : entry.value;

        return (
          <div key={index} className="flex items-center gap-1.5">
            {!hideIcon && (
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: entry.color }}
              />
            )}
            <span className="text-muted-foreground text-sm">{label}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

// Export all Recharts components
const {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Rectangle,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} = RechartsPrimitive;

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
};
