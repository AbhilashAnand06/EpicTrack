import React from "react";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import PortfolioAllocation from "@/components/dashboard/PortfolioAllocation";
import StocksList from "@/components/dashboard/StocksList";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-8 tour-dashboard">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your financial portfolio overview</p>
      </div>
      
      <div className="tour-portfolio-summary">
        <PortfolioSummary />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-1 min-w-0 tour-performance-chart">
          <PerformanceChart />
        </div>
        <div className="col-span-1 md:col-span-1 min-w-0 tour-allocation">
          <PortfolioAllocation />
        </div>
      </div>
      
      <div className="tour-stocks">
        <StocksList />
      </div>
    </div>
  );
};

export default Dashboard;
