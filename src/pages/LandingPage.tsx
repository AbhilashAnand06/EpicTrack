import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PieChart, LineChart, BarChart3, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Portfolio Analysis",
    description: "Track and analyze your investments with detailed metrics and visualizations.",
    icon: PieChart,
  },
  {
    title: "Market Overview",
    description: "Stay up-to-date with real-time market data and price movements.",
    icon: LineChart,
  },
  {
    title: "Performance Analytics",
    description: "Dive deep into your portfolio performance with comprehensive analytics tools.",
    icon: BarChart3,
  },
  {
    title: "Security First",
    description: "Your financial data is encrypted and secured with industry-standard protocols.",
    icon: Shield,
  },
  {
    title: "Expert Support",
    description: "Get help from our team of financial experts whenever you need it.",
    icon: Users,
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/EquiTrack logo.png" alt="EquiTrack Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">EquiTrack</span>
          </div>
          <Link to="/dashboard">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Track Your Investments, <br />
              <span className="text-primary">Maximize Your Returns</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              EquiTrack helps you monitor your portfolio, analyze performance, and make better investment decisions with powerful analytics.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Smart Investing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Investments?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of investors who use EquiTrack to optimize their portfolios and reach their financial goals.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8">
                Start Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/EquiTrack logo.png" alt="EquiTrack Logo" className="w-6 h-6" />
              <span className="font-semibold">EquiTrack</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EquiTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 