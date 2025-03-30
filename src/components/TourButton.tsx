import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface TourStep {
  title: string;
  description: string;
  image?: string;
}

const TourButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      title: "Welcome to EquiTrack!",
      description: "This sidebar helps you navigate through different sections of the app."
    },
    {
      title: "Dashboard",
      description: "This is your dashboard, providing a quick overview of your portfolio performance."
    },
    {
      title: "Portfolio Summary",
      description: "Here you can see a summary of your portfolio value, gains, and other key metrics."
    },
    {
      title: "Performance Chart",
      description: "Track your portfolio's performance over time with interactive charts."
    },
    {
      title: "Asset Allocation",
      description: "See how your investments are distributed across different sectors."
    },
    {
      title: "Stocks List",
      description: "View and manage all your stocks in one place."
    },
    {
      title: "Help",
      description: "You can restart this tour anytime by clicking this help button."
    },
    {
      title: "Theme Customizer",
      description: "Customize your experience by changing the theme and appearance."
    }
  ];

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full tour-help"
          >
            <HelpCircle size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={startTour}>
            Start guided tour
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tourSteps[currentStep].title}</DialogTitle>
            <DialogDescription>
              {tourSteps[currentStep].description}
            </DialogDescription>
          </DialogHeader>
          
          {tourSteps[currentStep].image && (
            <div className="my-4 border rounded-md overflow-hidden">
              <img 
                src={tourSteps[currentStep].image} 
                alt={tourSteps[currentStep].title} 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="text-sm text-muted-foreground text-center">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          
          <DialogFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button onClick={nextStep}>
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TourButton; 