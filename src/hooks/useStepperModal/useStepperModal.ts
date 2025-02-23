import { useState } from 'react';

const useStepperModal = (stepLabels: string[]) => {
  const totalSteps = stepLabels.length;

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep < totalSteps - 1 ? prevActiveStep + 1 : totalSteps - 1
    );
  };

  const handleBack = (decrement = 1) => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep - decrement >= 0 ? prevActiveStep - decrement : 0
    );
  };

  const goToNextStep = () => {
    setCompletedSteps((prevCompletedSteps) => ({ ...prevCompletedSteps, [activeStep]: true }));
    handleNext();
  };

  const goToPreviousStep = (decrement = 1) => {
    setCompletedSteps((prevCompletedSteps) => {
      const newCompletedSteps = { ...prevCompletedSteps };

      const stepToReset = Math.max(activeStep - decrement, 0);

      for (let i = stepToReset; i < activeStep; i++) {
        newCompletedSteps[i] = false;
      }

      return newCompletedSteps;
    });

    handleBack(decrement);
  };

  const resetAllSteps = () => {
    setActiveStep(0);
    setCompletedSteps({});
  };

  const getStepDetails = () => {
    return {
      activeStep,
      stepLabels,
      completedSteps,
    };
  };

  return {
    getStepDetails,
    goToNextStep,
    goToPreviousStep,
    resetAllSteps,
  };
};

export default useStepperModal;
