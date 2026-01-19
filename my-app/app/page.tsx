"use client";

import { useState, useEffect } from "react";
import Header from "./components/common/DeepSearch/Header";
import Footer from "./components/common/DeepSearch/Footer";
import Loader from "./components/common/DeepSearch/Loader";
import FormRenderer from "./components/common/DeepSearch/FormRenderer";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({});

  // location + propertyType + plotSize + configuration + budget + projectType + developer = 7 steps
  const MAX_TOTAL_STEPS = 7;

  // Progress based only on current step, not on selections
  // This ensures progress only advances when clicking "Continue"
  const completionPercentage =
    MAX_TOTAL_STEPS > 0 ? (currentStep / (MAX_TOTAL_STEPS - 1)) * 100 : 0;

  const handleNext = () => {
    if (currentStep < MAX_TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form submitted!", formData);
      alert("Form submitted successfully!");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleNext(); // Skip just moves to next step
  };

  // Handle form data updates from FormRenderer
  const handleFormDataUpdate = (newFormData: any) => {
    setFormData(newFormData);
  };

  // Reset to step 0 if needed
  useEffect(() => {
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-grid">
        {/* Loader at the top - receives percentage from parent */}
        <div className="w-full mt-[36px] relative z-[60]">
          <Loader percentage={completionPercentage} />
        </div>

        {/* Form */}
        <div className="h-full flex items-center justify-center">
          <FormRenderer
            onStepChange={setCurrentStep}
            currentStep={currentStep}
            onValidationChange={setIsValid}
            onFormDataUpdate={handleFormDataUpdate}
          />
        </div>
      </main>

      <Footer
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        showBack={currentStep > 0}
        isNextDisabled={!isValid}
        currentStep={currentStep}
        totalSteps={MAX_TOTAL_STEPS}
      />
    </div>
  );
}
