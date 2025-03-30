import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Download, 
  Star, 
  StarOff,
  Plus,
  FileText
} from "lucide-react";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import WatchlistManager from "@/components/dashboard/WatchlistManager";
import { useWatchlists } from "@/hooks/use-watchlists";
import { stockData } from "@/lib/data";
import { exportToCsv } from "@/utils/csv-export";
import { useIsMobile } from "@/hooks/use-mobile";

const Market: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedRange, setSelectedRange] = useState("1W");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const { 
    watchlists, 
    activeWatchlist, 
    setActiveWatchlistId,
    addToWatchlist,
    removeFromWatchlist
  } = useWatchlists();
  
  // Filter stocks based on search term, market segment, and active watchlist
  const filteredStocks = stockData
    .filter(stock => 
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(stock => selectedMarket === "all" || stock.sector === selectedMarket)
    .filter(stock => 
      activeWatchlist.id === "default" || 
      activeWatchlist.stocks.includes(stock.symbol)
    );
  
  // Sort stocks by performance (percentage change)
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    return sortDirection === "desc" 
      ? b.changePercent - a.changePercent 
      : a.changePercent - b.changePercent;
  });
  
  const sectors = [...new Set(stockData.map(stock => stock.sector))];
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };
  
  const toggleWatchlist = (symbol: string) => {
    // Default watchlist can't be modified
    if (activeWatchlist.id === "default") {
      toast({
        title: "Cannot modify default watchlist",
        description: "Create a new watchlist to add stocks.",
        variant: "destructive"
      });
      return;
    }
    
    if (activeWatchlist.stocks.includes(symbol)) {
      removeFromWatchlist(activeWatchlist.id, symbol);
      toast({
        title: "Removed from watchlist",
        description: `${symbol} removed from ${activeWatchlist.name}`
      });
    } else {
      addToWatchlist(activeWatchlist.id, symbol);
      toast({
        title: "Added to watchlist",
        description: `${symbol} added to ${activeWatchlist.name}`
      });
    }
  };
  
  const handleExportCsv = () => {
    const columns = [
      { header: "Symbol", dataKey: "symbol" },
      { header: "Name", dataKey: "name" },
      { header: "Price", dataKey: "price" },
      { header: "Change %", dataKey: "changePercent" },
      { header: "Volume", dataKey: "volume" },
      { header: "Sector", dataKey: "sector" }
    ];
    
    const data = sortedStocks.map(stock => ({
      ...stock,
      volume: Math.floor(stock.shares * stock.price / 10) * 10
    }));
    
    exportToCsv(
      data,
      columns,
      `market-data-${activeWatchlist.id}-${selectedMarket}.csv`
    );
    
    toast({
      title: "CSV export complete",
      description: "Your market data has been downloaded as CSV"
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Market Overview</h1>
        <p className="text-muted-foreground">Explore market trends and discover investment opportunities</p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <WatchlistManager 
          onSelectWatchlist={setActiveWatchlistId}
          selectedWatchlistId={activeWatchlist.id}
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-between">
            <TimeRangeSelector 
              selectedRange={selectedRange} 
              onChange={setSelectedRange} 
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedMarket} onValueChange={setSelectedMarket}>
        <TabsList className="mb-4 w-full justify-start overflow-auto">
          <TabsTrigger value="all">All Sectors</TabsTrigger>
          {sectors.map(sector => (
            <TabsTrigger key={sector} value={sector}>{sector}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedMarket} className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Market Performance</CardTitle>
                  <CardDescription>
                    Showing {sortedStocks.length} stocks for {selectedMarket === "all" ? "all sectors" : selectedMarket}
                  </CardDescription>
                </div>
                {sortedStocks.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportCsv}
                    className="shrink-0"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 md:grid-cols-6 p-4 bg-muted/50 font-medium text-sm">
                  <div>Symbol</div>
                  <div className="hidden md:block">Name</div>
                  <div>Price</div>
                  <div 
                    className="flex items-center gap-1 cursor-pointer" 
                    onClick={toggleSortDirection}
                  >
                    Change <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div className="hidden md:block">Volume</div>
                  <div className="text-right md:text-left">Action</div>
                </div>
                
                {sortedStocks.length > 0 ? (
                  sortedStocks.map(stock => (
                    <div key={stock.id} className="grid grid-cols-4 md:grid-cols-6 p-4 border-t items-center hover:bg-muted/50 transition-colors">
                      <div className="font-mono font-medium">{stock.symbol}</div>
                      <div className="hidden md:block truncate">{stock.name}</div>
                      <div className="font-mono">${stock.price.toFixed(2)}</div>
                      <div className={`font-mono ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                      </div>
                      <div className="hidden md:block font-mono">
                        {Math.floor(stock.shares * stock.price / 10) * 10}
                      </div>
                      <div className="flex justify-end md:justify-start items-center gap-1">
                        {stock.changePercent >= 0 ? 
                          <TrendingUp className="text-green-500 h-5 w-5" /> : 
                          <TrendingDown className="text-red-500 h-5 w-5" />
                        }
                        {activeWatchlist.id !== "default" && (
                          <Button
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleWatchlist(stock.symbol)}
                          >
                            {activeWatchlist.stocks.includes(stock.symbol) ? (
                              <Star className="h-4 w-4 fill-primary text-primary" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    {activeWatchlist.id !== "default" && activeWatchlist.stocks.length === 0 ? (
                      <div className="flex flex-col items-center gap-2">
                        <p>This watchlist is empty</p>
                        <Button variant="outline" size="sm" onClick={() => setActiveWatchlistId("default")}>
                          Browse all stocks
                        </Button>
                      </div>
                    ) : (
                      <p>No stocks found matching your criteria</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Market;
