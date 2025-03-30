import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, ArrowDownRight, ArrowUpRight, Check, AlertTriangle } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { stockData, portfolioStats } from "@/lib/data";
import { useTheme } from "@/hooks/use-theme";

// Risk data component
const RiskAssessment = () => {
  const riskData = [
    { type: "Volatility", value: 68 },
    { type: "Diversification", value: 82 },
    { type: "Drawdown", value: 55 },
    { type: "Beta", value: 75 },
    { type: "Sharpe Ratio", value: 60 },
  ];

  const overallRiskScore = 72;
  const riskLevel = overallRiskScore >= 75 ? "Low" : overallRiskScore >= 50 ? "Medium" : "High";
  const riskColors = {
    Low: "text-green-500",
    Medium: "text-amber-500",
    High: "text-red-500"
  };

  return (
    <>
      <div className="flex flex-col items-center mb-2">
        <div className="text-2xl font-bold mt-1">{overallRiskScore}/100</div>
        <div className={`text-sm font-medium ${riskColors[riskLevel]}`}>{riskLevel} Risk</div>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
            <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
            <PolarAngleAxis dataKey="type" tick={{ fill: 'currentColor', fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Risk Factors" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

// Sector diversification component
const SectorDiversification = () => {
  const { sectorAllocation } = portfolioStats;
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8B5CF6", "#EC4899", "#F43F5E"];
  
  // Target allocations for comparison
  const targetAllocation = [
    { name: "Technology", target: 30 },
    { name: "Financial Services", target: 20 },
    { name: "Healthcare", target: 15 },
    { name: "Consumer Cyclical", target: 15 },
    { name: "Communication Services", target: 10 },
    { name: "Other", target: 10 },
  ];
  
  // Mapping actual allocations and targets
  const diversificationData = sectorAllocation.map((sector, index) => {
    const target = targetAllocation.find(t => t.name === sector.name)?.target || 10;
    const diff = sector.percentage - target;
    return {
      name: sector.name,
      actual: sector.percentage,
      target: target,
      diff: diff,
      status: Math.abs(diff) < 5 ? "optimal" : diff > 0 ? "overweight" : "underweight",
      color: COLORS[index % COLORS.length]
    };
  });
  
  return (
    <div className="space-y-4">
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={diversificationData}
            layout="vertical"
            margin={{ top: 0, right: 10, bottom: 0, left: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `${value}%`} 
              domain={[0, 'dataMax']}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 10 }} 
              width={70} 
            />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background p-2 border rounded-md shadow-sm">
                      <p className="font-medium text-sm">{data.name}</p>
                      <p className="text-xs">Actual: {data.actual.toFixed(1)}%</p>
                      <p className="text-xs">Target: {data.target}%</p>
                      <p className="text-xs">
                        Difference: {data.diff > 0 ? '+' : ''}{data.diff.toFixed(1)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="actual" 
              radius={[0, 4, 4, 0]} 
              name="Allocation"
            >
              {diversificationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {diversificationData.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center text-xs p-1 whitespace-nowrap overflow-hidden"
            title={`${item.name}: ${item.actual.toFixed(1)}% (${item.status}, diff: ${item.diff > 0 ? '+' : ''}${item.diff.toFixed(1)}%)`}
          >
            <div 
              className="w-2 h-2 rounded-full flex-shrink-0 mr-1.5" 
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tax efficiency component
const TaxEfficiency = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const taxData = [
    { name: "Ordinary Income", value: 24.5, taxable: 18.7, taxSaved: 5.8 },
    { name: "Long-term Gains", value: 12.8, taxable: 7.2, taxSaved: 5.6 },
    { name: "Dividends", value: 5.2, taxable: 3.1, taxSaved: 2.1 },
    { name: "Tax-free Returns", value: 8.1, taxable: 0, taxSaved: 8.1 }
  ];
  
  const totalTaxable = taxData.reduce((sum, item) => sum + item.taxable, 0);
  const totalValue = taxData.reduce((sum, item) => sum + item.value, 0);
  const totalSaved = taxData.reduce((sum, item) => sum + item.taxSaved, 0);
  
  const taxEfficiencyScore = Math.round((totalSaved / totalValue) * 100);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-2">
        <div className="text-2xl font-bold">{taxEfficiencyScore}%</div>
        <div className="text-sm text-muted-foreground">Tax Efficiency</div>
      </div>
      
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={taxData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barGap={0}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={(value) => `$${value}K`} />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background p-2 border rounded-md shadow-sm">
                      <p className="font-medium text-sm">{data.name}</p>
                      <p className="text-xs">Total: ${data.value}K</p>
                      <p className="text-xs">Taxable: ${data.taxable}K</p>
                      <p className="text-xs">Tax Saved: ${data.taxSaved}K</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="taxable" name="Taxable" stackId="a" fill="hsl(var(--destructive)/0.8)" />
            <Bar dataKey="taxSaved" name="Tax Saved" stackId="a" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1 rounded-sm bg-primary"></div>
          <span>Tax Saved</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1 rounded-sm bg-destructive/80"></div>
          <span>Taxable</span>
        </div>
      </div>
    </div>
  );
};

// Portfolio management component
const PortfolioManagement = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  
  // Calculate some portfolio metrics
  const totalValue = portfolioStats.totalValue;
  const totalGain = portfolioStats.totalGain;
  const gainPercentage = portfolioStats.totalGainPercent;
  
  const annualDividends = stockData.reduce(
    (sum, stock) => sum + (stock.value * 0.025), // Assume 2.5% dividend yield on average
    0
  );
  
  // Example rebalancing recommendations
  const rebalancingActions = [
    { action: "Buy", symbol: "AAPL", amount: 3, reasoning: "Underweight in Tech sector" },
    { action: "Sell", symbol: "JPM", amount: 2, reasoning: "Overweight in Financial sector" },
    { action: "Buy", symbol: "JNJ", amount: 2, reasoning: "Underweight in Healthcare sector" },
  ];

  // Function to export data as CSV
  const exportData = () => {
    // Create CSV content
    const headers = ['Metric', 'Value', 'Period'];
    const rows = [
      ['Portfolio Value', `$${totalValue.toFixed(2)}`, 'Current'],
      ['Total Gain/Loss', `$${totalGain.toFixed(2)}`, 'All-time'],
      ['Return Percentage', `${gainPercentage.toFixed(2)}%`, 'All-time'],
      ['YTD Return', '12.8%', 'Year-to-date'],
      ['1Y Return', '15.4%', '1 Year'],
      ['3Y Return', '42.1%', '3 Years'],
      ['5Y Return', '67.5%', '5 Years'],
      ['Annual Dividends', `$${annualDividends.toFixed(2)}`, 'Annual'],
      ['Dividend Yield', `${(annualDividends / totalValue * 100).toFixed(2)}%`, 'Annual']
    ];
    
    // Format as CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and link for download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Investment goals data
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Retirement Fund",
      current: 804000,
      target: 1200000,
      targetDate: "2045",
      progress: 67
    },
    {
      id: 2,
      name: "Home Purchase",
      current: 63000,
      target: 150000,
      targetDate: "2025",
      progress: 42
    },
    {
      id: 3,
      name: "Education Fund",
      current: 71200,
      target: 80000,
      targetDate: "2027",
      progress: 89
    }
  ]);
  
  // New goal form state
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: 0,
    current: 0,
    targetDate: new Date().getFullYear() + 5 + ""
  });
  
  // Contribution adjustment state
  const [contributions, setContributions] = useState({
    goalId: 1,
    amount: 500,
    frequency: "monthly"
  });
  
  // Handle form submission for new goal
  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target > 0) {
      const progress = (newGoal.current / newGoal.target) * 100;
      setGoals([...goals, {
        id: goals.length + 1,
        name: newGoal.name,
        current: newGoal.current,
        target: newGoal.target,
        targetDate: newGoal.targetDate,
        progress: Math.round(progress)
      }]);
      setNewGoal({
        name: "",
        target: 0,
        current: 0,
        targetDate: new Date().getFullYear() + 5 + ""
      });
      setShowGoalModal(false);
    }
  };
  
  // Handle contribution adjustment
  const handleAdjustContribution = () => {
    // In a real app, this would update a database or state
    // Here we'll just close the modal
    setShowContributionModal(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col">
          <div className="text-sm text-muted-foreground">Portfolio Value</div>
          <div className="text-2xl font-bold mt-1">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(totalValue)}
          </div>
          <div className={`flex items-center mt-1 text-sm ${gainPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {gainPercentage >= 0 ? 
              <ArrowUpRight size={16} className="mr-1" /> : 
              <ArrowDownRight size={16} className="mr-1" />}
            {gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%
          </div>
        </Card>
        
        <Card className="p-4 flex flex-col">
          <div className="text-sm text-muted-foreground">Total Gain/Loss</div>
          <div className="text-2xl font-bold mt-1">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(totalGain)}
          </div>
          <div className={`flex items-center mt-1 text-sm ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalGain >= 0 ? 
              <ArrowUpRight size={16} className="mr-1" /> : 
              <ArrowDownRight size={16} className="mr-1" />}
            {totalGain >= 0 ? 'Profit' : 'Loss'}
          </div>
        </Card>
        
        <Card className="p-4 flex flex-col">
          <div className="text-sm text-muted-foreground">Annual Dividend Income</div>
          <div className="text-2xl font-bold mt-1">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(annualDividends)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Yield: {(annualDividends / totalValue * 100).toFixed(2)}%
          </div>
        </Card>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button 
            className={`px-4 py-2 text-sm font-medium ${selectedTab === 'overview' ? 'bg-muted border-b-2 border-primary' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${selectedTab === 'rebalance' ? 'bg-muted border-b-2 border-primary' : ''}`}
            onClick={() => setSelectedTab('rebalance')}
          >
            Rebalancing
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${selectedTab === 'goals' ? 'bg-muted border-b-2 border-primary' : ''}`}
            onClick={() => setSelectedTab('goals')}
          >
            Goals
          </button>
        </div>
        
        <div className="p-4">
          {selectedTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Performance Summary</h3>
                  <p className="text-sm text-muted-foreground">Overall portfolio metrics</p>
                </div>
                <Button variant="outline" size="sm" onClick={exportData}>Export Data</Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">YTD Return</div>
                  <div className="font-medium">+12.8%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">1Y Return</div>
                  <div className="font-medium">+15.4%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">3Y Return</div>
                  <div className="font-medium">+42.1%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">5Y Return</div>
                  <div className="font-medium">+67.5%</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Portfolio Health</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Diversification</span>
                      <span>Good</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Management</span>
                      <span>Moderate</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tax Efficiency</span>
                      <span>Excellent</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'rebalance' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Rebalancing Recommendations</h3>
                <p className="text-sm text-muted-foreground">Suggested actions to optimize your portfolio</p>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Action</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Symbol</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Reasoning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rebalancingActions.map((action, index) => (
                      <tr key={index}>
                        <td className={`px-4 py-2 text-sm ${action.action === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                          {action.action}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium">{action.symbol}</td>
                        <td className="px-4 py-2 text-sm">{action.amount} shares</td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">{action.reasoning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end">
                <Button size="sm">Apply Recommendations</Button>
              </div>
            </div>
          )}
          
          {selectedTab === 'goals' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Investment Goals</h3>
                <p className="text-sm text-muted-foreground">Track progress toward your financial targets</p>
              </div>
              
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <TrendingUp size={16} className="mr-2 text-primary" />
                        <span className="font-medium text-sm">{goal.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{goal.progress}% of {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0
                      }).format(goal.target)}</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-muted-foreground">Current: {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0
                      }).format(goal.current)}</span>
                      <span className="text-muted-foreground">Target Date: {goal.targetDate}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowGoalModal(true)}>Add Goal</Button>
                <Button size="sm" onClick={() => setShowContributionModal(true)}>Adjust Contributions</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Goal Dialog */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Investment Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="e.g., Vacation Fund"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Amount ($)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={newGoal.target || ''}
                  onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Amount ($)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={newGoal.current || ''}
                  onChange={(e) => setNewGoal({...newGoal, current: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Year</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  placeholder="2030"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowGoalModal(false)}>Cancel</Button>
                <Button onClick={handleAddGoal}>Add Goal</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Adjust Contributions Dialog */}
      {showContributionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Adjust Goal Contributions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Goal</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={contributions.goalId}
                  onChange={(e) => setContributions({...contributions, goalId: Number(e.target.value)})}
                >
                  {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contribution Amount ($)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={contributions.amount}
                  onChange={(e) => setContributions({...contributions, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={contributions.frequency}
                  onChange={(e) => setContributions({...contributions, frequency: e.target.value})}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowContributionModal(false)}>Cancel</Button>
                <Button onClick={handleAdjustContribution}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Portfolio: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Portfolio Analysis</h1>
        <p className="text-muted-foreground">Detailed insights into your investment portfolio</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Risk Assessment</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[220px] text-sm">Risk assessment evaluates your portfolio's volatility and potential for loss.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Analyze your portfolio's risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskAssessment />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Sector Diversification</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[220px] text-sm">Diversification across sectors helps reduce portfolio risk.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>View sector allocation across holdings</CardDescription>
          </CardHeader>
          <CardContent>
            <SectorDiversification />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Tax Efficiency</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[220px] text-sm">Tax efficiency analysis helps optimize after-tax returns.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Optimize tax impact of your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <TaxEfficiency />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portfolio Management</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[220px] text-sm">Portfolio management tools help you track and adjust your investments.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <PortfolioManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
