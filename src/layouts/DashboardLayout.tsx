import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeCustomizer from "@/components/ThemeCustomizer";

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };
  
  return (
    <div className="h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          <>
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar 
                  isCollapsed={false} 
                  toggleSidebar={() => setIsMobileSidebarOpen(false)} 
                  onNavigate={() => setIsMobileSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        )}
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 p-3 md:p-6",
            !isMobile && (isSidebarCollapsed ? "md:ml-16" : "md:ml-64")
          )}
        >
          <div className="container mx-auto max-w-7xl px-2">
            <Outlet />
          </div>
        </main>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeCustomizer />
      </div>
    </div>
  );
};

export default DashboardLayout;
