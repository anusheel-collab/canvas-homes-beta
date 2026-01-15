"use client";
import Checkbox from "@mui/material/Checkbox";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { MapPin, X, Home } from "lucide-react";
import { formConfig, FormField, FormStep } from "./formConfig";
import RangeSlider from "./RangeSlider";
import { cn } from "./utils/cn";
import { MapModal } from "./MapModal";

// ============================================
// INTERFACE DEFINITIONS
// ============================================

interface FormRendererProps {
  onStepChange: (currentStep: number) => void;
  currentStep: number;
  onValidationChange?: (isValid: boolean) => void;
  onFormDataUpdate?: (formData: any) => void;
}

interface FormData {
  [key: string]: any;
}

interface SearchQuery {
  [key: string]: string;
}

// ============================================
// MAIN FORM RENDERER COMPONENT
// ============================================

const FormRenderer: React.FC<FormRendererProps> = ({
  onStepChange,
  currentStep,
  onValidationChange,
  onFormDataUpdate,
}) => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [formData, setFormData] = useState<FormData>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({});

  // ADD THESE STATES FOR MAP MODAL
  const [showMapModal, setShowMapModal] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const getVisibleSteps = useMemo(() => {
    return formConfig.steps.filter((step) => {
      if (!step.condition) return true;
      return step.condition(formData);
    });
  }, [formData]);

  const currentVisibleStep = getVisibleSteps[currentStep];
  const currentStepConfig = currentVisibleStep;
  const totalVisibleSteps = getVisibleSteps.length;

  // ============================================
  // MAP SELECTION HANDLER
  // ============================================

  const handleMapSelection = (selectedArea: any) => {
    console.log("Selected area from map:", selectedArea);

    if (activeField) {
      // Update the form field with the selected area
      handleFieldChange(activeField, "Custom Drawn Area");

      // Also store the detailed map selection
      handleFieldChange("selectedLocation", {
        type: "mapSelection",
        coordinates: selectedArea.coordinates || [],
        area: selectedArea.area || "Custom Drawn Area",
        propertyCount: selectedArea.propertyCount || 0,
        displayName: "Custom Drawn Area",
      });

      // Update search query to show the selected area
      setSearchQuery((prev) => ({
        ...prev,
        [activeField]: "Custom Drawn Area",
      }));
    }

    setShowMapModal(false);
    setShowSuggestions(false);
  };

  // ============================================
  // DYNAMIC TITLE HANDLING
  // ============================================

  const getStepTitle = (step: FormStep | undefined) => {
    if (!step) return "";
    if (typeof step.title === "function") {
      return step.title(formData);
    }
    return step.title || "";
  };

  const currentTitle = getStepTitle(currentStepConfig);

  // ============================================
  // FIELD FILTERING LOGIC
  // ============================================

  const visibleFields = useMemo(() => {
    if (!currentStepConfig) return [];
    return (
      currentStepConfig.fields.filter((field) => {
        if (!field.condition) return true;
        return field.condition(formData);
      }) || []
    );
  }, [currentStepConfig, formData]);

  // ============================================
  // VALIDATION LOGIC
  // ============================================

  const isStepValid = useMemo(() => {
    if (!currentStepConfig) return false;
    return visibleFields.every((field) => {
      if (!field.required) return true;
      const value = formData[field.name];
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (field.type === "range") {
        return value.min !== undefined && value.max !== undefined;
      }
      return true;
    });
  }, [visibleFields, formData, currentStepConfig]);

  // ============================================
  // EFFECTS FOR PARENT COMMUNICATION
  // ============================================

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isStepValid);
    }
  }, [isStepValid, onValidationChange]);

  useEffect(() => {
    if (onFormDataUpdate) {
      onFormDataUpdate(formData);
    }
  }, [formData, onFormDataUpdate]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleFieldChange = (fieldName: string, value: any) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
  };

  const handleAutocomplete = (
    fieldName: string,
    query: string,
    field: FormField
  ) => {
    setSearchQuery((prev) => ({ ...prev, [fieldName]: query }));
    setActiveField(fieldName);

    if (query.length > 0 && field.getSuggestions) {
      const results = field.getSuggestions(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (fieldName: string, value: string) => {
    handleFieldChange(fieldName, value);
    setSearchQuery((prev) => ({ ...prev, [fieldName]: value }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // ============================================
  // RENDER FIELD FUNCTION
  // ============================================

  const renderField = (field: FormField) => {
    const Icon = field.icon;
    switch (field.type) {
      case "autocomplete":
        return (
          <div className="relative w-full max-w-[470px] mx-auto">
            <div
              className="flex items-center gap-3 bg-white transition-colors"
              style={{
                border: "1px solid #D4D4D4",
                paddingTop: "4px",
                paddingBottom: "4px",
                paddingLeft: "16px",
                paddingRight: "16px",
                borderRadius: "6px",
              }}
            >
              {Icon && <Icon className="w-5 h-5 text-[#737373]" />}

              <input
                type="text"
                value={searchQuery[field.name] || ""}
                onChange={(e) =>
                  handleAutocomplete(field.name, e.target.value, field)
                }
                onFocus={() => {
                  setActiveField(field.name);
                  if (
                    searchQuery[field.name]?.length > 0 &&
                    field.getSuggestions
                  ) {
                    const results = field.getSuggestions(
                      searchQuery[field.name]
                    );
                    setSuggestions(results);
                    setShowSuggestions(true);
                  }
                }}
                placeholder={field.placeholder}
                className="flex-1 outline-none text-gray-800 placeholder:text-[#737373]"
                style={{
                  border: "none",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  backgroundColor: "#FAFAFA",
                }}
              />
            </div>

            {showSuggestions && activeField === field.name && (
              <div
                className="absolute left-0 z-10 w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-2"
                style={{
                  border: "1px solid #D4D4D4",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  borderRadius: "6px",
                  borderColor: "#D4D4D4",
                }}
              >
                {/* MAP SEARCH OPTION - ALWAYS SHOW AT TOP */}
                <div
                  onClick={() => {
                    setShowMapModal(true);
                    setShowSuggestions(false);
                  }}
                  className="group px-[8px] py-[10px] hover:bg-[#F5F5F5] cursor-pointer flex items-center gap-4 rounded-[6px] transition-colors border-b border-gray-100"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-[8px] px-[12px] py-[12px] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <svg
                      className="w-5 h-5 stroke-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span
                      className="text-gray-800 font-semibold"
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "16px",
                        color: "#262626",
                      }}
                    >
                      Search on Map
                    </span>
                    <span className="text-sm text-gray-500 mt-0.5">
                      Draw your preferred area on the map
                    </span>
                  </div>
                  <div className="ml-auto">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* REGULAR SUGGESTIONS */}
                {suggestions.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-gray-50">
                      <span className="text-xs font-medium text-gray-500">
                        SUGGESTED LOCATIONS
                      </span>
                    </div>
                    {suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestion(field.name, suggestion)}
                        className="group px-[8px] py-[10px] hover:bg-[#F5F5F5] cursor-pointer flex items-center gap-4 rounded-[6px] transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#F5F5F5] rounded-[8px] px-[12px] py-[12px] flex items-center justify-center group-hover:bg-[#D4D4D4] transition-colors">
                          <MapPin className="w-5 h-5 stroke-[#525252]" />
                        </div>

                        <span
                          className="text-gray-700 font-medium"
                          style={{
                            padding: "8px 8px",
                            fontFamily: "Manrope, sans-serif",
                            fontSize: "16px",
                            color: "#262626",
                          }}
                        >
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        );

      // [Keep the rest of your cases as they were...]
      case "multiselect":
      case "multiselect-search": {
        // ... rest of your existing code for multiselect
      }

      case "singleselect": {
        // ... rest of your existing code for singleselect
      }

      case "range": {
        // ... rest of your existing code for range
      }

      default:
        return null;
    }
  };

  // ============================================
  // INVENTORY COUNT DISPLAY LOGIC
  // ============================================

  const inventoryCount =
    currentStep === 0
      ? "10,166"
      : currentStep === 1
      ? "2,000"
      : currentStep === 2
      ? "800"
      : currentStep === 3
      ? "600"
      : currentStep === 4
      ? "200"
      : "10,056";

  // ============================================
  // LOADING STATE
  // ============================================

  if (!currentStepConfig) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* FORM CONTAINER */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* INVENTORY BADGE */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full"
              style={{
                paddingTop: "8px",
                paddingBottom: "8px",
                paddingLeft: "20px",
                paddingRight: "20px",
                backgroundColor: "#CCFBF1",
              }}
            >
              <img src="/house.svg" alt="Home" className="w-5 h-5" />
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#115E59",
                }}
              >
                {inventoryCount} Inventory{" "}
                {currentStep === 0 ? "Available" : "Matched"}
              </span>
            </div>
          </div>

          {/* STEP TITLE */}
          <h2
            className="text-center mb-12 max-w-3xl mx-auto leading-tight"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: "36px",
              fontWeight: 600,
              color: "#404040",
            }}
          >
            {currentTitle}
          </h2>

          {/* FORM FIELDS CONTAINER */}
          <div className="space-y-8">
            {visibleFields.map((field) => (
              <div key={field.name} className="space-y-4">
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAP MODAL - RENDERED AT ROOT LEVEL */}
      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onMapSelect={handleMapSelection}
      />
    </>
  );
};

export default FormRenderer;
