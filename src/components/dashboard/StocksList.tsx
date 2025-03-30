import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Search, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { stockData } from "@/lib/data";
import { cn } from "@/lib/utils";

const StocksList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const filteredStocks = stockData.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Your Stocks</CardTitle>
            <CardDescription className="mt-1">Manage and track your stock portfolio</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stocks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-w-full">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-[30%]" />
                  <Skeleton className="h-12 w-[15%]" />
                  <Skeleton className="h-12 w-[15%]" />
                  <Skeleton className="h-12 w-[15%]" />
                  <Skeleton className="h-12 w-[15%]" />
                </div>
              ))}
            </div>
          ) : filteredStocks.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-right font-medium">Shares</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Change</th>
                  <th className="px-4 py-3 text-right font-medium">Value</th>
                  <th className="px-4 py-3 text-right font-medium">Return</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                  <tr key={stock.id} className="border-b hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-xs text-muted-foreground">
                          {stock.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{stock.shares}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(stock.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className={cn(
                          "flex items-center justify-end",
                          stock.change >= 0 ? "text-gain" : "text-loss"
                        )}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span className="font-mono">
                          {formatPercentage(stock.changePercent)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(stock.value)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "font-mono",
                          stock.value > stock.cost ? "text-gain" : "text-loss"
                        )}
                      >
                        {formatCurrency(stock.value - stock.cost)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/70 mb-4" />
              <h3 className="text-lg font-medium mb-1">No stocks found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn't find any stocks matching your search criteria.
              </p>
              <button 
                className="text-primary text-sm font-medium"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StocksList;
