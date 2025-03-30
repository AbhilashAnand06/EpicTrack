import React, { createContext, useContext, useState, useEffect } from 'react';

type TourContextType = {
  isTourOpen: boolean;
  startTour: () => void;
  closeTour: () => void;
  currentTourStep: number;
  setCurrentTourStep: (step: number) => void;
  hasSeenTour: boolean;
  markTourSeen: () => void;
};

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // Check localStorage on initial load
  useEffect(() => {
    const tourSeen = localStorage.getItem('equitrack-tour-seen') === 'true';
    setHasSeenTour(tourSeen);
    
    // Auto start tour for first time users with a delay
    if (!tourSeen && window.location.pathname.includes('/dashboard')) {
      // Wait for DOM to fully load and render before starting tour
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setCurrentTourStep(0); // Always restart from the beginning
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    setCurrentTourStep(0); // Reset step when closing
  };

  const markTourSeen = () => {
    localStorage.setItem('equitrack-tour-seen', 'true');
    setHasSeenTour(true);
  };

  return (
    <TourContext.Provider 
      value={{ 
        isTourOpen, 
        startTour, 
        closeTour, 
        currentTourStep, 
        setCurrentTourStep,
        hasSeenTour,
        markTourSeen
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}; 