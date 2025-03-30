import { ThemeProvider } from "@/hooks/use-theme";
import { TourProvider } from "@/hooks/use-tour";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Market from "./pages/Market";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import GuidedTour from "./components/GuidedTour";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TourProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Index />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="market" element={<Market />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GuidedTour />
          </BrowserRouter>
        </TooltipProvider>
      </TourProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
