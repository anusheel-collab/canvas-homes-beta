"use client";

import { useState } from "react";
import Header from "./components/common/DeepSearch/Header";
import Footer from "./components/common/DeepSearch/Footer";
import Loader from "./components/common/DeepSearch/Loader";
import FormRenderer from "./components/common/DeepSearch/FormRenderer";
import { formConfig } from "./components/common/DeepSearch/formConfig";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);

  // FIXED: Calculate percentage to reach 100% on last step
  // If you have 6 steps (indices 0-5), formula should be:
  // Step 0: 0/5 * 100 = 0%
  // Step 1: 1/5 * 100 = 20%
  // Step 2: 2/5 * 100 = 40%
  // Step 3: 3/5 * 100 = 60%
  // Step 4: 4/5 * 100 = 80%
  // Step 5: 5/5 * 100 = 100%
  const completionPercentage =
    (currentStep / (formConfig.steps.length - 1)) * 100;

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
            onStepChange={setCurrentStep} // Pass the setter function
            currentStep={currentStep} // Pass the current step value
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
