"use client";

import { useState, useEffect } from "react";
import Header from "./components/common/DeepSearch/Header";
import Footer from "./components/common/DeepSearch/Footer";
import Loader from "./components/common/DeepSearch/Loader";
import FormRenderer from "./components/common/DeepSearch/FormRenderer/index";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({});

  // States for the transition
  const [isWelcomeActive, setIsWelcomeActive] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Typewriter states
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [titleComplete, setTitleComplete] = useState(false);

  const fullTitle = "Hi there! 👋 Ready to find your home?";
  const fullSubtitle = "Let's start! This takes less than a minute...";

  const MAX_TOTAL_STEPS = 7;
  const completionPercentage =
    MAX_TOTAL_STEPS > 0 ? (currentStep / (MAX_TOTAL_STEPS - 1)) * 100 : 0;

  // Typewriter effect for title
  useEffect(() => {
    if (displayedTitle.length < fullTitle.length) {
      const timeout = setTimeout(() => {
        setDisplayedTitle(fullTitle.slice(0, displayedTitle.length + 1));
      }, 50); // Adjust speed here (lower = faster)
      return () => clearTimeout(timeout);
    } else {
      setTitleComplete(true);
    }
  }, [displayedTitle, fullTitle]);

  // Typewriter effect for subtitle (starts after title is complete)
  useEffect(() => {
    if (titleComplete && displayedSubtitle.length < fullSubtitle.length) {
      const timeout = setTimeout(() => {
        setDisplayedSubtitle(
          fullSubtitle.slice(0, displayedSubtitle.length + 1),
        );
      }, 40); // Adjust speed here (lower = faster)
      return () => clearTimeout(timeout);
    }
  }, [displayedSubtitle, fullSubtitle, titleComplete]);

  useEffect(() => {
    // Start fading at 4 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4000);

    // Remove completely at 4.5 seconds
    const removeTimer = setTimeout(() => {
      setIsWelcomeActive(false);
    }, 4500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleNext = () => {
    if (currentStep < MAX_TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form submitted!", formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleFormDataUpdate = (newFormData: any) => {
    setFormData(newFormData);
  };

  // Welcome Screen
  if (isWelcomeActive) {
    return (
      <div
        className={`min-h-screen bg-grid flex flex-col items-center justify-center transition-opacity duration-500 ${
          isFadingOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="text-center px-4">
          <h1 className="text-[42px] font-archivo font-semibold text-[#404040] leading-tight min-h-[120px]">
            {displayedTitle}
            {!titleComplete && <span className="animate-pulse">|</span>}
          </h1>
          <p className="text-[20px] font-manrope text-gray-500 mt-6 min-h-[60px]">
            {displayedSubtitle}
            {titleComplete &&
              displayedSubtitle.length < fullSubtitle.length && (
                <span className="animate-pulse">|</span>
              )}
          </p>
        </div>
      </div>
    );
  }

  // Normal Form View (Visible after fade out)
  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-700">
      <Header />

      <main className="flex-1 bg-grid">
        <div className="w-full mt-[46px] relative z-[60]">
          <Loader percentage={completionPercentage} />
        </div>

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
        onSkip={handleNext}
        showBack={currentStep > 0}
        isNextDisabled={!isValid}
        currentStep={currentStep}
        totalSteps={MAX_TOTAL_STEPS}
      />
    </div>
  );
}
