import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { portfolioStats } from "@/lib/data";
import { Lightbulb, TrendingUp } from "lucide-react";

type ScenarioType = "bullish" | "bearish" | "stagnant" | "custom";

interface ScenarioParams {
  marketReturn: number;
  timeHorizon: number;
  riskLevel: number;
  contribution: number;
}

const ScenarioTester: React.FC = () => {
  const [scenarioType, setScenarioType] = useState<ScenarioType>("bullish");
  const [params, setParams] = useState<ScenarioParams>({
    marketReturn: 8,
    timeHorizon: 5,
    riskLevel: 3,
    contribution: 5000,
  });
  const [scenarioData, setScenarioData] = useState<any[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(portfolioStats.totalValue);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Set predefined scenario parameters
  const handleScenarioTypeChange = (type: ScenarioType) => {
    setScenarioType(type);
    
    switch (type) {
      case "bullish":
        setParams({
          marketReturn: 12,
          timeHorizon: 5,
          riskLevel: 4,
          contribution: 5000,
        });
        break;
      case "bearish":
        setParams({
          marketReturn: -2,
          timeHorizon: 5, 
          riskLevel: 2,
          contribution: 5000,
        });
        break;
      case "stagnant":
        setParams({
          marketReturn: 3,
          timeHorizon: 5,
          riskLevel: 1,
          contribution: 5000,
        });
        break;
      case "custom":
        // Keep existing params
        break;
    }
  };

  // Change individual parameter
  const handleParamChange = (paramName: keyof ScenarioParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [paramName]: value
    }));
    
    // If we're adjusting a parameter manually, switch to custom scenario
    if (scenarioType !== "custom") {
      setScenarioType("custom");
    }
  };

  // Calculate the projected portfolio growth based on the parameters
  const calculateScenario = () => {
    setIsCalculating(true);
    
    // Starting with current portfolio value
    let currentValue = portfolioStats.totalValue;
    const newScenarioData = [];
    
    // Calculate monthly return rate (annual rate divided by 12)
    const monthlyReturnRate = params.marketReturn / 100 / 12;
    
    // Monthly contribution
    const monthlyContribution = params.contribution / 12;
    
    // Convert years to months
    const months = params.timeHorizon * 12;
    
    // Risk factor affects volatility
    const volatilityFactor = params.riskLevel * 0.5;
    
    // Calculate for each month
    for (let month = 0; month <= months; month++) {
      // Add some random volatility based on risk level
      const volatility = (Math.random() - 0.5) * volatilityFactor;
      
      if (month > 0) {
        // Apply monthly return + volatility
        currentValue = currentValue * (1 + monthlyReturnRate + volatility / 100);
        
        // Add monthly contribution
        currentValue += monthlyContribution;
      }
      
      // Add data point
      newScenarioData.push({
        month: month,
        value: Math.round(currentValue),
        date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7)
      });
    }
    
    setScenarioData(newScenarioData);
    setPortfolioValue(newScenarioData[newScenarioData.length - 1].value);
    setIsCalculating(false);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };
  
  React.useEffect(() => {
    // Calculate initial scenario on component mount
    calculateScenario();
  }, []);

  return (
    <TabsContent value="scenarios" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Scenario Testing</CardTitle>
          <CardDescription>
            Explore different investment scenarios and see how they might affect your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Scenario Type</Label>
                <Select
                  value={scenarioType}
                  onValueChange={(value) => handleScenarioTypeChange(value as ScenarioType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scenario type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullish">Bullish Market</SelectItem>
                    <SelectItem value="bearish">Bearish Market</SelectItem>
                    <SelectItem value="stagnant">Stagnant Market</SelectItem>
                    <SelectItem value="custom">Custom Scenario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Market Return Rate</Label>
                    <span className="text-sm font-mono">{formatPercentage(params.marketReturn)}</span>
                  </div>
                  <Slider
                    value={[params.marketReturn]}
                    min={-10}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => handleParamChange("marketReturn", value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Time Horizon (Years)</Label>
                    <span className="text-sm font-mono">{params.timeHorizon}</span>
                  </div>
                  <Slider
                    value={[params.timeHorizon]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleParamChange("timeHorizon", value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Risk Level</Label>
                    <span className="text-sm font-mono">{params.riskLevel} of 5</span>
                  </div>
                  <Slider
                    value={[params.riskLevel]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleParamChange("riskLevel", value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Annual Contribution</Label>
                    <span className="text-sm font-mono">{formatCurrency(params.contribution)}</span>
                  </div>
                  <Slider
                    value={[params.contribution]}
                    min={0}
                    max={50000}
                    step={500}
                    onValueChange={(value) => handleParamChange("contribution", value[0])}
                  />
                </div>
              </div>
              
              <Button 
                onClick={calculateScenario} 
                className="w-full"
                disabled={isCalculating}
              >
                Calculate Scenario
              </Button>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-primary h-5 w-5" />
                <h3 className="font-semibold">Projected Portfolio Value</h3>
              </div>
              
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(portfolioValue)}
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                {`In ${params.timeHorizon} ${params.timeHorizon === 1 ? 'year' : 'years'} with ${formatPercentage(params.marketReturn)} annual return`}
              </div>
              
              <div className="h-[250px]">
                {scenarioData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={scenarioData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(date) => date.split('-')[0]}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [formatCurrency(value), "Portfolio Value"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#6366F1" 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border flex gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Investment Insight</p>
              <p className="text-muted-foreground">
                {params.marketReturn > 8 
                  ? "In high-return scenarios, consider increasing your risk tolerance to maximize growth potential."
                  : params.marketReturn < 0
                  ? "During market downturns, regular contributions can help you buy more shares at lower prices."
                  : "A balanced portfolio with regular contributions is key to long-term growth in moderate markets."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ScenarioTester;
