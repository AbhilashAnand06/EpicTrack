import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PieChart, BarChart3, LineChart, Wallet, ChevronFirst, ChevronLast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onNavigate?: () => void;
}

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Portfolio",
    icon: PieChart,
    path: "/dashboard/portfolio",
  },
  {
    title: "Market",
    icon: BarChart3,
    path: "/dashboard/market",
  },
  {
    title: "Transactions",
    icon: Wallet,
    path: "/dashboard/transactions",
  },
  {
    title: "Analytics",
    icon: LineChart,
    path: "/dashboard/analytics",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, onNavigate }) => {
  const location = useLocation();
  
  const handleNavigation = () => {
    if (onNavigate) onNavigate();
  };
  
  return (
    <div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col border-r bg-background transition-all duration-300 tour-sidebar",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <img src="/EquiTrack logo.png" alt="EquiTrack Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold">EquiTrack</span>
          </div>
        ) : (
          <img src="/EquiTrack logo.png" alt="EquiTrack Logo" className="w-8 h-8" />
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Sidebar"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronLast size={18} /> : <ChevronFirst size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              )}
              onClick={handleNavigation}
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
