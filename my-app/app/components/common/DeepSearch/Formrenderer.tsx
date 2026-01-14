"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MapPin, X, Home } from "lucide-react";
import { formConfig, FormField, FormStep } from "./formConfig";
import RangeSlider from "./RangeSlider";
import { cn } from "./utils/cn";

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

const FormRenderer: React.FC<FormRendererProps> = ({
  onStepChange,
  currentStep,
  onValidationChange,
  onFormDataUpdate,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({});

  // Filter steps based on conditions
  const getVisibleSteps = useMemo(() => {
    return formConfig.steps.filter((step) => {
      if (!step.condition) return true;
      return step.condition(formData);
    });
  }, [formData]);

  // Get the current step from visible steps
  const currentVisibleStep = getVisibleSteps[currentStep];
  const currentStepConfig = currentVisibleStep;
  const totalVisibleSteps = getVisibleSteps.length;

  // Safe function to get dynamic title based on form data
  const getStepTitle = (step: FormStep | undefined) => {
    if (!step) return "";

    if (typeof step.title === "function") {
      return step.title(formData);
    }
    return step.title || "";
  };

  const currentTitle = getStepTitle(currentStepConfig);

  const visibleFields = useMemo(() => {
    if (!currentStepConfig) return [];

    return (
      currentStepConfig.fields.filter((field) => {
        if (!field.condition) return true;
        return field.condition(formData);
      }) || []
    );
  }, [currentStepConfig, formData]);

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

  const renderField = (field: FormField) => {
    const Icon = field.icon;

    switch (field.type) {
      case "autocomplete":
        return (
          <div className="relative w-full max-w-[470px] mx-auto">
            <div
              className="flex items-center gap-3 px-4 py-3 border-2 rounded-2xl focus-within:border-[#D4D4D4] bg-white transition-colors"
              style={{ borderColor: "#D4D4D4" }}
            >
              {Icon && <Icon className="w-5 h-5 text-[#737373]" />}
              <input
                type="text"
                value={searchQuery[field.name] || ""}
                onChange={(e) =>
                  handleAutocomplete(field.name, e.target.value, field)
                }
                placeholder={field.placeholder}
                className="flex-1 outline-none text-gray-800 placeholder:text-[#737373]"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute z-10 w-full mt-3 bg-white border-2 rounded-2xl shadow-xl overflow-hidden"
                style={{ borderColor: "#D4D4D4" }}
              >
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(field.name, suggestion)}
                    className="px-5 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <span
                      className="text-gray-700 font-medium"
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "16px",
                      }}
                    >
                      {suggestion}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "multiselect":
      case "multiselect-search": {
        const options = field.filterOptions
          ? field.filterOptions(field.options || [], formData)
          : field.options || [];

        const selectedValues: string[] = formData[field.name] || [];
        const isSearchable = field.type === "multiselect-search";
        const searchTerm = searchQuery[field.name] || "";

        const filteredOptions =
          isSearchable && searchTerm
            ? options.filter((opt) =>
                opt.label.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : options;

        return (
          <div className="w-full space-y-6 max-w-4xl mx-auto">
            {isSearchable && (
              <div
                className="max-w-[448px] mx-auto bg-white border-2 rounded-2xl p-3"
                style={{ borderColor: "#D4D4D4" }}
              >
                {selectedValues.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 px-1">
                    <div
                      className="flex items-center gap-2 text-[#737373]"
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      <img
                        src="/home.svg"
                        alt="Developers"
                        className="w-5 h-5"
                      />
                      <span>Developers</span>
                    </div>
                    {selectedValues.map((val) => {
                      const opt = options.find((o) => o.value === val);
                      return (
                        <div
                          key={val}
                          className="px-3 py-1 bg-white border border-gray-800 rounded-lg text-sm font-medium flex items-center gap-2"
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontSize: "14px",
                          }}
                        >
                          {opt?.label}
                          <button
                            onClick={() =>
                              handleFieldChange(
                                field.name,
                                selectedValues.filter((v) => v !== val)
                              )
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="relative mb-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchQuery((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    placeholder={field.searchPlaceholder || "Search..."}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:border-gray-400 outline-none"
                    style={{
                      borderColor: "#D4D4D4",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div className="space-y-0 max-h-[150px] overflow-y-auto">
                  {filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        onClick={() =>
                          handleFieldChange(
                            field.name,
                            isSelected
                              ? selectedValues.filter((v) => v !== option.value)
                              : [...selectedValues, option.value]
                          )
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                      >
                        <div
                          className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                            isSelected
                              ? "bg-black border-black"
                              : "border-gray-300 bg-white"
                          }`}
                          style={{ borderRadius: "4px" }}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className="text-gray-800 font-medium"
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontSize: "16px",
                          }}
                        >
                          {option.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!isSearchable && (
              <div className="flex flex-wrap justify-center gap-6">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleFieldChange(
                          field.name,
                          isSelected
                            ? selectedValues.filter((v) => v !== option.value)
                            : [...selectedValues, option.value]
                        )
                      }
                      className={`relative text-center transition-all bg-white ${
                        isSelected ? "border-2 border-black" : "border-2"
                      }`}
                      style={{
                        width: "168px",
                        paddingTop: "12px",
                        paddingBottom: "20px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        borderColor: isSelected ? "#000000" : "#A3A3A3",
                        borderRadius: "16px",
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        {option.icon && (
                          <div className="w-full h-32 flex items-center justify-center">
                            <img
                              src={`/${
                                option.value === "plot"
                                  ? "Plot"
                                  : option.value === "apartment"
                                  ? "Apartment"
                                  : option.value === "villa"
                                  ? "Villa"
                                  : option.value === "villament"
                                  ? "Villament"
                                  : option.value === "rowhouses"
                                  ? "RowHouses"
                                  : "Plot"
                              }.svg`}
                              alt={option.label}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div
                          className="font-semibold text-gray-800"
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          {option.label}
                        </div>
                        <div
                          className={`w-6 h-6 border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-black border-black"
                              : "border-gray-400 bg-white"
                          }`}
                          style={{ borderRadius: "4px" }}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case "singleselect": {
        const selectedValue = formData[field.name];

        return (
          <div className="space-y-6">
            {field.label === "Project Type" ? (
              <div className="flex flex-wrap justify-center gap-6">
                {field.options?.map((option) => {
                  const isSelected = selectedValue === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleFieldChange(field.name, option.value)
                      }
                      className={`relative text-center transition-all bg-white ${
                        isSelected ? "border-2 border-black" : "border-2"
                      }`}
                      style={{
                        width: "168px",
                        paddingTop: "12px",
                        paddingBottom: "20px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        borderColor: isSelected ? "#000000" : "#A3A3A3",
                        borderRadius: "16px",
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-full h-32 flex items-center justify-center">
                          <img
                            src={`/${
                              option.value === "prelaunch"
                                ? "PreLaunch"
                                : option.value === "underconstruction"
                                ? "UnderConstruction"
                                : "ReadyToMove"
                            }.svg`}
                            alt={option.label}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div
                          className="font-semibold text-gray-800"
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          {option.label}
                        </div>
                        <div
                          className={`w-6 h-6 border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-black border-black"
                              : "border-gray-400 bg-white"
                          }`}
                          style={{ borderRadius: "4px" }}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {field.options?.map((option) => {
                  const isSelected = selectedValue === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleFieldChange(field.name, option.value)
                      }
                      className={`font-semibold transition-all ${
                        isSelected
                          ? "border-2 border-black bg-white"
                          : "border-2 bg-white"
                      }`}
                      style={{
                        width: "173px",
                        height: "48px",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        borderColor: isSelected ? "#000000" : "#A3A3A3",
                        borderRadius: "16px",
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#404040",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case "range": {
        const rangeValue = formData[field.name] || {
          min: field.minValue,
          max: field.maxValue,
        };

        const handleRangeChange = (value: any) => {
          handleFieldChange(field.name, {
            min: value[0],
            max: value[1],
          });
        };

        const handleMaxChange = (max: number) => {
          handleFieldChange(field.name, {
            ...rangeValue,
            max: max || rangeValue.min,
          });
        };

        const handleMinChange = (min: number) => {
          handleFieldChange(field.name, {
            ...rangeValue,
            min: min || field.minValue || 0,
          });
        };

        const formatFn =
          field.formatValue || ((v: number) => `${v.toLocaleString()}`);

        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="px-4">
              <RangeSlider
                range
                min={field.minValue}
                max={field.maxValue}
                value={[rangeValue.min, rangeValue.max]}
                onChange={(value: any) => handleRangeChange(value)}
                className={cn("[&>.rc-slider-step]:hidden")}
              />
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="flex-1 max-w-xs">
                <div
                  className="overflow-hidden border-2 rounded-2xl bg-white shadow-sm"
                  style={{ borderColor: "#D4D4D4" }}
                >
                  <div
                    className="px-5 pt-3 text-sm text-gray-500"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    From
                  </div>
                  <input
                    type="number"
                    value={rangeValue.min}
                    onChange={(e) => handleMinChange(parseInt(e.target.value))}
                    className="w-full border-none bg-white px-5 pb-3 text-2xl font-bold text-gray-800 outline-none focus:shadow-none focus:ring-0"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                    min={field.minValue}
                    max={rangeValue.max}
                    readOnly
                  />
                  <div
                    className="px-5 pb-3 text-xs text-gray-400"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    ₹{(rangeValue.min / 100000).toFixed(2)} Lac
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-xs">
                <div
                  className="overflow-hidden border-2 rounded-2xl bg-white shadow-sm"
                  style={{ borderColor: "#D4D4D4" }}
                >
                  <div
                    className="px-5 pt-3 text-sm text-gray-500"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    To
                  </div>
                  <input
                    type="number"
                    value={rangeValue.max}
                    onChange={(e) => handleMaxChange(parseInt(e.target.value))}
                    className="w-full border-none bg-white px-5 pb-3 text-2xl font-bold text-gray-800 outline-none focus:shadow-none focus:ring-0"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                    min={rangeValue.min}
                    readOnly
                  />
                  <div
                    className="px-5 pb-3 text-xs text-gray-400"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    ₹{(rangeValue.max / 10000000).toFixed(1)} Crs
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Mock inventory count based on step
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

  if (!currentStepConfig) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        {/* Inventory badge */}
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

        {/* Title - now dynamic based on form data */}
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

        {/* Form fields */}
        <div className="space-y-8">
          {visibleFields.map((field) => (
            <div key={field.name} className="space-y-4">
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* REMOVED: Navigation buttons section */}
        {/* The buttons are now only in the Footer component */}
      </div>
    </div>
  );
};

export default FormRenderer;
