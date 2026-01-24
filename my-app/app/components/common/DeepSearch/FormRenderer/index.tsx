"use client";
import React from "react";
import { FormField } from "../formConfig";
import { useFormLogic } from "./hooks/useFormLogic";
import { FormRendererProps } from "./types";
import { getInventoryCount } from "./utils/validation";

// Import field components
import LocationField from "./fields/LocationField";
import PropertyTypeField from "./fields/PropertyTypeField";
import DeveloperField from "./fields/DeveloperField";
import ProjectTypeField from "./fields/ProjectTypeField";
import PossessionField from "./fields/PossessionField";
import BudgetField from "./fields/BudgetField";
import PlotSizeField from "./fields/PlotSizeField";

const FormRenderer: React.FC<FormRendererProps> = ({
  onStepChange,
  currentStep,
  onValidationChange,
  onFormDataUpdate,
}) => {
  // Use the form logic hook
  const {
    formData,
    searchQuery,
    suggestions,
    showSuggestions,
    showMapModal,
    activeField,
    isLocating,
    locationError,
    selectedLocation,
    selectedRadius,
    showMapPreview,
    setSearchQuery,
    setShowSuggestions,
    setShowMapModal,
    setSelectedRadius,
    handleFieldChange,
    handleAutocomplete,
    selectSuggestion,
    getCurrentLocation,
    handleMapSelection,
    handleInputFocus,
    currentStepConfig,
    visibleFields,
    currentTitle,
  } = useFormLogic(currentStep, onValidationChange, onFormDataUpdate);

  // Handle search query change
  const handleSearchQueryChange = (fieldName: string, value: string) => {
    setSearchQuery((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    switch (field.type) {
      case "autocomplete":
        return (
          <LocationField
            field={field}
            formData={formData}
            searchQuery={searchQuery}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            activeField={activeField}
            showMapModal={showMapModal}
            isLocating={isLocating}
            locationError={locationError}
            selectedLocation={selectedLocation}
            selectedRadius={selectedRadius}
            showMapPreview={showMapPreview}
            currentStep={currentStep}
            onFieldChange={handleFieldChange}
            onSearchQueryChange={handleSearchQueryChange}
            onAutocomplete={handleAutocomplete}
            onSelectSuggestion={selectSuggestion}
            onGetCurrentLocation={getCurrentLocation}
            onSetShowMapModal={setShowMapModal}
            onSetShowSuggestions={setShowSuggestions}
            onHandleMapSelection={handleMapSelection}
            onHandleInputFocus={handleInputFocus}
            onSetSelectedRadius={setSelectedRadius}
          />
        );

      case "multiselect":
        return (
          <PropertyTypeField
            field={field}
            formData={formData}
            onFieldChange={handleFieldChange}
          />
        );

      case "multiselect-search":
        return (
          <DeveloperField
            field={field}
            formData={formData}
            searchQuery={searchQuery}
            onFieldChange={handleFieldChange}
            onSearchQueryChange={handleSearchQueryChange}
          />
        );

      case "singleselect":
        // 1. Check for Project Type first
        if (field.name === "projectType") {
          return (
            <ProjectTypeField
              field={field}
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          );
        }

        // 2. Check if this is the possessionBy field
        if (field.name === "possessionBy") {
          // Only show PossessionField if "underConstruction" is selected in the projectType array
          const isUnderConstruction =
            formData.projectType?.includes("underConstruction");

          if (isUnderConstruction) {
            return (
              <PossessionField
                field={field}
                formData={formData}
                onFieldChange={handleFieldChange}
              />
            );
          }

          // If not underConstruction, return null so it stays hidden
          return null;
        }
      case "range":
        if (field.name === "budget") {
          return (
            <BudgetField
              field={field}
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          );
        } else if (field.name === "plotSize") {
          return (
            <PlotSizeField
              field={field}
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  if (!currentStepConfig) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  const inventoryCount = getInventoryCount(currentStep);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* FORM CONTAINER */}
        <div>
          {/* INVENTORY BADGE */}
          <div className="flex mt-[25px] justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full py-[8px] px-[20px] bg-[#CCFBF1]">
              <img src="/house.svg" alt="Home" className="w-5 h-5" />
              <span className="font-manrope text-[16px] font-semibold text-[#115E59]">
                {inventoryCount} Inventory{" "}
                {currentStep === 0 ? "Available" : "Matched"}
              </span>
            </div>
          </div>

          {/* STEP TITLE */}
          <h2 className="text-center mb-12 max-w-[690px] mx-auto leading-tight font-archivo text-[24px] sm:text-[28px]  md:text-[34px] lg:text-[36px] font-semibold text-[#404040]">
            {currentTitle}
          </h2>

          {/* FORM FIELDS CONTAINER */}
          <div className="space-y-8">
            {visibleFields.map((field) => (
              <div key={field.name} className="space-y-4 mt-[56px]">
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormRenderer;
