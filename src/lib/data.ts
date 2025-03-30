
// Mock data for the financial portfolio dashboard

export interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
  value: number;
  dayChange: number;
  cost: number;
  sector: string;
  color: string;
  history: HistoryPoint[];
}

export interface HistoryPoint {
  date: string;
  value: number;
}

export const timeRanges = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: 'YTD' },
  { value: '5Y', label: '5Y' },
];

// Function to generate random history data
const generateHistory = (
  days: number, 
  startValue: number, 
  volatility: number
): HistoryPoint[] => {
  const data: HistoryPoint[] = [];
  let currentValue = startValue;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to create realistic stock movement
    const change = (Math.random() - 0.5) * volatility * currentValue;
    currentValue = Math.max(0.1, currentValue + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2))
    });
  }
  
  return data;
};

export const stockData: StockData[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 172.25,
    change: 2.68,
    changePercent: 1.58,
    shares: 15,
    value: 2583.75,
    dayChange: 40.2,
    cost: 2100,
    sector: 'Technology',
    color: '#34D399',
    history: generateHistory(365, 145, 0.02)
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 320.75,
    change: -1.25,
    changePercent: -0.39,
    shares: 8,
    value: 2566,
    dayChange: -10,
    cost: 2200,
    sector: 'Technology',
    color: '#60A5FA',
    history: generateHistory(365, 280, 0.015)
  },
  {
    id: '3',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 132.15,
    change: 0.85,
    changePercent: 0.65,
    shares: 12,
    value: 1585.8,
    dayChange: 10.2,
    cost: 1400,
    sector: 'Consumer Cyclical',
    color: '#F472B6',
    history: generateHistory(365, 100, 0.025)
  },
  {
    id: '4',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 137.42,
    change: -0.53,
    changePercent: -0.38,
    shares: 10,
    value: 1374.2,
    dayChange: -5.3,
    cost: 1200,
    sector: 'Communication Services',
    color: '#A78BFA',
    history: generateHistory(365, 120, 0.018)
  },
  {
    id: '5',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 245.75,
    change: 5.28,
    changePercent: 2.2,
    shares: 5,
    value: 1228.75,
    dayChange: 26.4,
    cost: 900,
    sector: 'Consumer Cyclical',
    color: '#F87171',
    history: generateHistory(365, 180, 0.04)
  },
  {
    id: '6',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 140.58,
    change: 0.92,
    changePercent: 0.66,
    shares: 10,
    value: 1405.8,
    dayChange: 9.2,
    cost: 1300,
    sector: 'Financial Services',
    color: '#FBBF24',
    history: generateHistory(365, 130, 0.016)
  },
  {
    id: '7',
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    price: 167.45,
    change: -0.32,
    changePercent: -0.19,
    shares: 8,
    value: 1339.6,
    dayChange: -2.56,
    cost: 1250,
    sector: 'Healthcare',
    color: '#6EE7B7',
    history: generateHistory(365, 160, 0.01)
  },
  {
    id: '8',
    symbol: 'V',
    name: 'Visa Inc.',
    price: 241.25,
    change: 1.75,
    changePercent: 0.73,
    shares: 6,
    value: 1447.5,
    dayChange: 10.5,
    cost: 1320,
    sector: 'Financial Services',
    color: '#818CF8',
    history: generateHistory(365, 220, 0.014)
  }
];

// Calculate portfolio total and performance
export const calculatePortfolioStats = () => {
  const totalValue = stockData.reduce((sum, stock) => sum + stock.value, 0);
  const totalCost = stockData.reduce((sum, stock) => sum + stock.cost, 0);
  const totalDayChange = stockData.reduce((sum, stock) => sum + stock.dayChange, 0);
  const totalDayChangePercent = (totalDayChange / (totalValue - totalDayChange)) * 100;
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;

  // Calculate sector allocation
  const sectors: Record<string, number> = {};
  stockData.forEach(stock => {
    if (sectors[stock.sector]) {
      sectors[stock.sector] += stock.value;
    } else {
      sectors[stock.sector] = stock.value;
    }
  });

  const sectorAllocation = Object.entries(sectors).map(([name, value]) => ({
    name,
    value,
    percentage: (value / totalValue) * 100
  }));

  // Generate portfolio history by combining all stock histories
  let portfolioHistory: { date: string; value: number }[] = [];
  
  // Get all unique dates from all stocks
  const allDates = new Set<string>();
  stockData.forEach(stock => {
    stock.history.forEach(point => {
      allDates.add(point.date);
    });
  });

  // Sort dates chronologically
  const sortedDates = Array.from(allDates).sort();
  
  // For each date, calculate the total portfolio value
  sortedDates.forEach(date => {
    let dateTotal = 0;
    
    stockData.forEach(stock => {
      const dataPoint = stock.history.find(point => point.date === date);
      if (dataPoint) {
        // Calculate the proportion of current value to determine historical allocation
        const proportion = stock.shares * (dataPoint.value / stock.price);
        dateTotal += proportion;
      }
    });
    
    portfolioHistory.push({
      date,
      value: parseFloat(dateTotal.toFixed(2))
    });
  });

  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent,
    totalDayChange,
    totalDayChangePercent,
    sectorAllocation,
    portfolioHistory
  };
};

export const portfolioStats = calculatePortfolioStats();
