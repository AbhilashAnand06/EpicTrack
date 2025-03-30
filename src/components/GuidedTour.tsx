import React, { useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, EVENTS } from 'react-joyride';
import { useTour } from '@/hooks/use-tour';
import { useLocation } from 'react-router-dom';

const GuidedTour: React.FC = () => {
  const { 
    isTourOpen, 
    closeTour, 
    currentTourStep, 
    setCurrentTourStep, 
    markTourSeen 
  } = useTour();
  const location = useLocation();

  // Reset tour if path changes
  useEffect(() => {
    if (isTourOpen && !location.pathname.includes('/dashboard')) {
      closeTour();
    }
  }, [location.pathname, isTourOpen, closeTour]);

  const steps: Step[] = [
    {
      target: '.tour-sidebar',
      content: 'Welcome to EquiTrack! This sidebar helps you navigate through different sections of the app.',
      disableBeacon: true,
      placement: 'right',
    },
    {
      target: '.tour-dashboard',
      content: 'This is your dashboard, providing a quick overview of your portfolio performance.',
      placement: 'bottom',
    },
    {
      target: '.tour-portfolio-summary',
      content: 'Here you can see a summary of your portfolio value, gains, and other key metrics.',
      placement: 'top',
    },
    {
      target: '.tour-performance-chart',
      content: 'Track your portfolio\'s performance over time with interactive charts.',
      placement: 'top',
    },
    {
      target: '.tour-allocation',
      content: 'See how your investments are distributed across different sectors.',
      placement: 'left',
    },
    {
      target: '.tour-stocks',
      content: 'View and manage all your stocks in one place.',
      placement: 'top',
    },
    {
      target: '.tour-help',
      content: 'You can restart this tour anytime by clicking this help button.',
      placement: 'left',
    },
    {
      target: '.tour-theme',
      content: 'Customize your experience by changing the theme and appearance.',
      placement: 'left',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    // Handle tour completion or skipping
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      closeTour();
      markTourSeen();
      return;
    }

    // Handle step changes
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setCurrentTourStep(index + (action === 'next' ? 1 : -1));
    } else if (type === EVENTS.STEP_BEFORE) {
      setCurrentTourStep(index);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={isTourOpen}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      stepIndex={currentTourStep}
      disableOverlayClose
      disableCloseOnEsc
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          backgroundColor: 'hsl(var(--background))',
          arrowColor: 'hsl(var(--background))',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        spotlight: {
          backgroundColor: 'transparent',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltip: {
          borderRadius: '8px',
          fontSize: '14px',
          padding: '16px',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          fontSize: '14px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'hsl(var(--primary))',
          fontSize: '14px',
          marginRight: '8px',
        },
      }}
      locale={{
        last: 'Finish',
        skip: 'Skip tour',
        next: 'Next',
        back: 'Back',
      }}
    />
  );
};

export default GuidedTour; 