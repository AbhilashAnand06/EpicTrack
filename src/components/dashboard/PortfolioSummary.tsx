import React from "react";
import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";
import { portfolioStats } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; 
import { cn } from "@/lib/utils";

const PortfolioSummary: React.FC = () => {
  const {
    totalValue,
    totalGain,
    totalGainPercent,
    totalDayChange,
    totalDayChangePercent,
  } = portfolioStats;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow duration-200 min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[180px] text-sm">Total current market value of all your investments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-2xl font-bold font-mono whitespace-nowrap overflow-hidden text-ellipsis">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Today's Change
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[180px] text-sm">Value change since previous market close</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono">
                {formatCurrency(totalDayChange)}
              </span>
              <div
                className={cn(
                  "flex items-center text-sm",
                  totalDayChange >= 0 ? "text-gain" : "text-loss"
                )}
              >
                {totalDayChange >= 0 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                <span>{formatPercentage(totalDayChangePercent)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Total Gain/Loss
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[180px] text-sm">Total gain or loss since initial investment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono">
                {formatCurrency(totalGain)}
              </span>
              <div
                className={cn(
                  "flex items-center text-sm",
                  totalGain >= 0 ? "text-gain" : "text-loss"
                )}
              >
                {totalGain >= 0 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                <span>{formatPercentage(totalGainPercent)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Assets
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[180px] text-sm">Number of unique assets in your portfolio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-2xl font-bold">8</span>
            <span className="text-sm text-muted-foreground">
              Across 4 sectors
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
