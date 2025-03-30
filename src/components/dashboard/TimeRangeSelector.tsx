import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { timeRanges } from "@/lib/data";

interface TimeRangeSelectorProps {
  selectedRange: string;
  onChange: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onChange,
}) => {
  // Map time ranges to more descriptive tooltips
  const rangeTooltips: Record<string, string> = {
    "1D": "Last 24 hours",
    "1W": "Past 7 days",
    "1M": "Past 30 days",
    "3M": "Past 3 months",
    "1Y": "Past 12 months",
    "5Y": "Past 5 years",
    "ALL": "All available history"
  };

  return (
    <div className="flex flex-wrap items-center gap-1 max-w-full">
      <TooltipProvider>
        {timeRanges.map((range) => (
          <Tooltip key={range.value}>
            <TooltipTrigger asChild>
              <Button
                variant={selectedRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => onChange(range.value)}
                className="h-8 px-2 text-xs sm:text-sm sm:px-3 sm:py-1"
              >
                {range.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{rangeTooltips[range.value] || `View ${range.label} data`}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default TimeRangeSelector;
