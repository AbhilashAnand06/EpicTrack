import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ArrowDownUp, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stockData } from "@/lib/data";
import { exportToCsv } from "@/utils/csv-export";
import { useToast } from "@/components/ui/use-toast";

// Mock transaction data based on existing stock data
interface Transaction {
  id: string;
  date: string;
  symbol: string;
  name: string;
  type: "buy" | "sell" | "dividend";
  price: number;
  shares: number;
  amount: number;
}

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  stockData.forEach(stock => {
    // Add a buy transaction
    transactions.push({
      id: `buy-${stock.id}`,
      date: new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      symbol: stock.symbol,
      name: stock.name,
      type: "buy",
      price: stock.price * 0.95, // Slightly lower than current price
      shares: stock.shares,
      amount: stock.price * 0.95 * stock.shares
    });
    
    // Add some random sells for a few stocks
    if (Math.random() > 0.7) {
      transactions.push({
        id: `sell-${stock.id}`,
        date: new Date(today.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        symbol: stock.symbol,
        name: stock.name,
        type: "sell",
        price: stock.price * 1.03, // Slightly higher than current price
        shares: Math.floor(stock.shares * 0.3), // Sell a portion
        amount: stock.price * 1.03 * Math.floor(stock.shares * 0.3)
      });
    }
    
    // Add dividend for some stocks
    if (Math.random() > 0.5) {
      transactions.push({
        id: `div-${stock.id}`,
        date: new Date(today.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        symbol: stock.symbol,
        name: stock.name,
        type: "dividend",
        price: 0,
        shares: 0,
        amount: stock.price * stock.shares * 0.02 // 2% dividend yield
      });
    }
  });
  
  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const Transactions: React.FC = () => {
  const { toast } = useToast();
  const [transactions] = useState<Transaction[]>(generateTransactions());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Filter transactions
  const filteredTransactions = transactions
    .filter(tx => 
      tx.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tx => activeTab === "all" || tx.type === activeTab);
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      return sortDirection === "desc" 
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return sortDirection === "desc" 
        ? b.amount - a.amount 
        : a.amount - b.amount;
    }
  });
  
  const handleSort = (column: "date" | "amount") => {
    if (sortBy === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "buy": return <ArrowDown className="h-4 w-4 text-green-500" />;
      case "sell": return <ArrowUp className="h-4 w-4 text-red-500" />;
      case "dividend": return <ArrowDownUp className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  // Export history to CSV
  const handleExportHistory = () => {
    const columns = [
      { header: "Date", dataKey: "date" },
      { header: "Type", dataKey: "type" },
      { header: "Symbol", dataKey: "symbol" },
      { header: "Name", dataKey: "name" },
      { header: "Price", dataKey: "price" },
      { header: "Shares", dataKey: "shares" },
      { header: "Amount", dataKey: "amount" }
    ];
    
    // Format transaction data for CSV export
    const formattedData = sortedTransactions.map(tx => ({
      ...tx,
      // Format the type field with capitalized first letter
      type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      // Handle special cases for dividend transactions
      price: tx.type === "dividend" ? 0 : tx.price,
      shares: tx.type === "dividend" ? 0 : tx.shares,
      // Format the amount with sign
      amount: tx.type === "buy" ? -tx.amount : tx.amount
    }));
    
    const tabNames = {
      all: "All",
      buy: "Purchases",
      sell: "Sales",
      dividend: "Dividends"
    };
    
    const fileName = `transaction-history-${activeTab}.csv`;
    
    exportToCsv(
      formattedData,
      columns,
      fileName
    );
    
    toast({
      title: "CSV export complete",
      description: `Your ${tabNames[activeTab as keyof typeof tabNames].toLowerCase()} transaction history has been downloaded as CSV`
    });
  };
  
  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground">Track your investment activities and dividend income</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExportHistory}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="buy">Purchases</TabsTrigger>
          <TabsTrigger value="sell">Sales</TabsTrigger>
          <TabsTrigger value="dividend">Dividends</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Transaction Log</CardTitle>
              <CardDescription>
                Showing {sortedTransactions.length} transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 md:grid-cols-7 p-4 bg-muted/50 font-medium text-sm">
                  <div 
                    className="flex items-center gap-1 cursor-pointer" 
                    onClick={() => handleSort("date")}
                  >
                    Date {sortBy === "date" && (
                      sortDirection === "desc" ? "↓" : "↑"
                    )}
                  </div>
                  <div className="hidden md:block">Type</div>
                  <div>Symbol</div>
                  <div className="hidden md:block">Name</div>
                  <div>Price</div>
                  <div>Shares</div>
                  <div 
                    className="flex items-center gap-1 cursor-pointer" 
                    onClick={() => handleSort("amount")}
                  >
                    Amount {sortBy === "amount" && (
                      sortDirection === "desc" ? "↓" : "↑"
                    )}
                  </div>
                </div>
                
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map(tx => (
                    <div key={tx.id} className="grid grid-cols-5 md:grid-cols-7 p-4 border-t items-center hover:bg-muted/50 transition-colors">
                      <div className="font-mono">{tx.date}</div>
                      <div className="hidden md:flex items-center gap-1">
                        {getTransactionTypeIcon(tx.type)}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                      <div className="font-mono font-medium">{tx.symbol}</div>
                      <div className="hidden md:block truncate">{tx.name}</div>
                      <div className="font-mono">
                        {tx.type === "dividend" ? "-" : `$${tx.price.toFixed(2)}`}
                      </div>
                      <div className="font-mono">
                        {tx.type === "dividend" ? "-" : tx.shares}
                      </div>
                      <div className={`font-mono font-medium ${
                        tx.type === "buy" ? "text-red-500" : "text-green-500"
                      }`}>
                        {tx.type === "buy" ? "-" : "+"}${tx.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No transactions found matching your criteria
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

export default Transactions;
