import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TimeRangeSelector from "./TimeRangeSelector";
import { portfolioStats } from "@/lib/data";
import { useTheme } from "@/hooks/use-theme";

const PerformanceChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState("1M");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  
  const isDarkMode = theme === "dark";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredData = useMemo(() => {
    const { portfolioHistory } = portfolioStats;
    const currentDate = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "1D":
        startDate.setDate(currentDate.getDate() - 1);
        break;
      case "1W":
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(currentDate.getMonth() - 3);
        break;
      case "1Y":
        startDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      case "5Y":
        startDate.setFullYear(currentDate.getFullYear() - 5);
        break;
      default:
        startDate.setMonth(currentDate.getMonth() - 1);
    }

    return portfolioHistory.filter((dataPoint) => {
      const pointDate = new Date(dataPoint.date);
      return pointDate >= startDate;
    });
  }, [timeRange]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm font-semibold text-primary font-mono">
            {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.previousValue && (
            <div className="mt-1 pt-1 border-t text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Previous:</span>
                <span className="font-mono">{formatCurrency(payload[0].payload.previousValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Change:</span>
                <span className={payload[0].value > payload[0].payload.previousValue ? "text-gain" : "text-loss"}>
                  {((payload[0].value - payload[0].payload.previousValue) / payload[0].payload.previousValue * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-3 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-2">
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Track your portfolio's growth over time</CardDescription>
        </div>
        <div className="mt-4 overflow-x-auto pb-1 -mr-2 pr-2">
          <TimeRangeSelector
            selectedRange={timeRange}
            onChange={setTimeRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  tickFormatter={(value) => {
                    if (timeRange === "1D") return value.split("T")[1]?.substring(0, 5) || value;
                    if (timeRange === "1W" || timeRange === "1M") {
                      const date = new Date(value);
                      return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
                    }
                    return new Date(value).toLocaleDateString(undefined, {
                      month: "short",
                      year: timeRange === "5Y" ? "2-digit" : undefined,
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  tickFormatter={(value) => formatCurrency(value)}
                  domain={['auto', 'auto']}
                  width={80}
                />
                <Tooltip content={customTooltip} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
