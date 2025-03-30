import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart, PieChart, Wallet, TrendingUp, Target, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import { stockData, portfolioStats } from "@/lib/data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar } from "recharts";
import ScenarioTester from "@/components/dashboard/ScenarioTester";
import { exportToCsv } from "@/utils/csv-export";
import { useToast } from "@/components/ui/use-toast";

const Analytics: React.FC = () => {
  const { toast } = useToast();
  const [selectedRange, setSelectedRange] = useState("1Y");
  const [activeTab, setActiveTab] = useState("performance");
  
  // Helper function to filter portfolio history data by time range
  const getFilteredHistoryData = () => {
    const history = portfolioStats.portfolioHistory;
    const now = new Date();
    let startDate: Date;
    
    switch (selectedRange) {
      case "1D":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case "1W":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "1Y":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "5Y":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        return history;
    }
    
    return history.filter(
      item => new Date(item.date) >= startDate
    );
  };
  
  // Format data for sector bar chart
  const sectorData = portfolioStats.sectorAllocation.map(sector => ({
    name: sector.name,
    value: parseFloat(sector.percentage.toFixed(1))
  }));
  
  // Stock performance comparison data
  const stockPerformanceData = stockData.map(stock => {
    const startPrice = stock.history[0].value;
    const endPrice = stock.price;
    const performancePercent = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
      name: stock.symbol,
      performance: parseFloat(performancePercent.toFixed(2))
    };
  }).sort((a, b) => b.performance - a.performance);
  
  // Monthly returns calculation
  const calculateMonthlyReturns = () => {
    const history = portfolioStats.portfolioHistory;
    const monthlyData = [];
    let currentMonth = "";
    let startValue = 0;
    
    history.forEach((point, index) => {
      const date = new Date(point.date);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (month !== currentMonth) {
        if (currentMonth !== "") {
          const monthReturn = ((point.value - startValue) / startValue) * 100;
          monthlyData.push({
            month: currentMonth,
            return: parseFloat(monthReturn.toFixed(2))
          });
        }
        currentMonth = month;
        startValue = point.value;
      }
    });
    
    return monthlyData.slice(-12); // Last 12 months
  };
  
  const monthlyReturns = calculateMonthlyReturns();
  
  // Portfolio performance metrics
  const metrics = [
    {
      name: "Total Return",
      value: `${portfolioStats.totalGainPercent.toFixed(2)}%`,
      icon: TrendingUp,
      color: portfolioStats.totalGainPercent >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      name: "Annualized Return",
      value: `${(portfolioStats.totalGainPercent / 2).toFixed(2)}%`,
      icon: Target,
      color: (portfolioStats.totalGainPercent / 2) >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      name: "Dividend Yield",
      value: "2.14%",
      icon: DollarSign,
      color: "text-blue-500"
    },
    {
      name: "Risk Score",
      value: "Moderate",
      icon: Wallet,
      color: "text-amber-500"
    }
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6', '#5DADE2', '#45B39D', '#F4D03F'];

  // Export analytics report as CSV
  const handleExportAnalytics = () => {
    let reportData;
    let columns;
    let fileName;
    
    // Determine which dataset to export based on active tab
    switch (activeTab) {
      case "performance":
        // Export performance data
        reportData = getFilteredHistoryData().map(point => ({
          date: point.date,
          value: point.value.toFixed(2)
        }));
        columns = [
          { header: "Date", dataKey: "date" },
          { header: "Portfolio Value", dataKey: "value" }
        ];
        fileName = `performance-data-${selectedRange}.csv`;
        break;
        
      case "allocation":
        // Export allocation data
        reportData = portfolioStats.sectorAllocation.map(sector => ({
          sector: sector.name,
          percentage: sector.percentage.toFixed(2),
          value: sector.value.toFixed(2)
        }));
        columns = [
          { header: "Sector", dataKey: "sector" },
          { header: "Allocation %", dataKey: "percentage" },
          { header: "Value", dataKey: "value" }
        ];
        fileName = "allocation-data.csv";
        break;
        
      case "comparison":
        // Export stock performance comparison
        reportData = stockPerformanceData.map(stock => ({
          symbol: stock.name,
          performance: stock.performance
        }));
        columns = [
          { header: "Symbol", dataKey: "symbol" },
          { header: "Performance %", dataKey: "performance" }
        ];
        fileName = "stock-comparison-data.csv";
        break;
        
      default:
        // Export monthly returns
        reportData = monthlyReturns.map(month => ({
          month: month.month,
          return: month.return
        }));
        columns = [
          { header: "Month", dataKey: "month" },
          { header: "Return %", dataKey: "return" }
        ];
        fileName = "monthly-returns-data.csv";
    }
    
    exportToCsv(
      reportData,
      columns,
      fileName
    );
    
    toast({
      title: "CSV export complete",
      description: `Your ${activeTab} data has been downloaded as CSV`
    });
  };
  
  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">In-depth analysis of your investment performance</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExportAnalytics}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <TimeRangeSelector 
          selectedRange={selectedRange} 
          onChange={setSelectedRange} 
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
              <CardTitle className={`text-xl ${metric.color}`}>{metric.value}</CardTitle>
              <p className="text-sm text-muted-foreground">{metric.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="mb-4 min-w-max">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="allocation" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Allocation
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Comparison
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Growth</CardTitle>
              <CardDescription>Historical value over {selectedRange} period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getFilteredHistoryData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                      formatter={(value) => `$${Number(value).toLocaleString()}`}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366F1" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="justify-end pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportAnalytics}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export Performance Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
              <CardDescription>Distribution of investments across sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      label={false}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="justify-end pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportAnalytics}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export Allocation Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Performance</CardTitle>
              <CardDescription>Performance comparison by stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBar
                    data={stockPerformanceData.slice(0, 10)}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar 
                      dataKey="performance" 
                      fill="#6366F1"
                      radius={[4, 4, 0, 0]} 
                    />
                  </RechartsBar>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="justify-end pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportAnalytics}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export Performance Comparison
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-4">
          <ScenarioTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
