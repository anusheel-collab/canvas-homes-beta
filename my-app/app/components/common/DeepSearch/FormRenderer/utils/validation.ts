// Validation utility functions

export const validateStep = (
  currentStepConfig: any,
  formData: any,
  selectedLocation: any,
  visibleFields: any[],
): boolean => {
  if (!currentStepConfig) return false;

  // Check if this is the location step
  if (currentStepConfig.id === "location") {
    // For location step, require a selected location to show map preview
    return !!selectedLocation && !!formData["location"];
  }

  // Special handling for projectType step
  if (currentStepConfig.id === "projectType") {
    // First check if projectType itself is selected
    const projectTypes = formData["projectType"];
    const hasProjectType =
      Array.isArray(projectTypes) && projectTypes.length > 0;

    if (!hasProjectType) return false;

    // Check if underConstruction is selected
    const isUnderConstructionSelected =
      projectTypes.includes("underConstruction");

    // If underConstruction is selected, possession field must also be selected
    if (isUnderConstructionSelected) {
      const possessionValue = formData["possessionBy"];
      return !!possessionValue;
    }

    // If underConstruction is NOT selected, just projectType selection is enough
    return true;
  }

  // For other steps, use original validation
  return visibleFields.every((field) => {
    // Skip validation if field has a condition and the condition is not met
    if (field.condition && !field.condition(formData)) {
      return true;
    }

    if (!field.required) return true;

    const value = formData[field.name];
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (field.type === "range") {
      return value.min !== undefined && value.max !== undefined;
    }
    return true;
  });
};

export const getInventoryCount = (currentStep: number): string => {
  const counts = ["10,166", "2,000", "800", "600", "200", "10,056", "10,056"];
  return counts[currentStep] || "10,056";
};

export const getStepTitle = (step: any, formData: any): string => {
  if (!step) return "";
  if (typeof step.title === "function") {
    return step.title(formData);
  }
  return step.title || "";
};
