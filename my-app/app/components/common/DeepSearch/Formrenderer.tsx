"use client";

import React, { useState, useMemo } from "react";
import { MapPin, X, Home } from "lucide-react";
import { formConfig, FormField } from "./formConfig";

interface FormRendererProps {
  onStepChange: (currentStep: number) => void;
  currentStep: number;
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
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({});

  const currentStepConfig = formConfig.steps[currentStep];

  const visibleFields = useMemo(() => {
    return currentStepConfig.fields.filter((field) => {
      if (!field.condition) return true;
      return field.condition(formData);
    });
  }, [currentStepConfig, formData]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
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

  const handleNext = () => {
    if (currentStep < formConfig.steps.length - 1) {
      const nextStep = currentStep + 1;
      setShowSuggestions(false);
      onStepChange(nextStep);
    } else {
      console.log("Form submitted:", formData);
      alert("Form submitted! Check console for data.");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setShowSuggestions(false);
      onStepChange(prevStep);
    }
  };

  const isStepValid = (): boolean => {
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
  };

  const renderField = (field: FormField) => {
    const Icon = field.icon;

    switch (field.type) {
      case "autocomplete":
        return (
          <div className="relative w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 px-5 py-4 border-2 border-gray-300 rounded-2xl focus-within:border-purple-600 bg-white transition-colors shadow-sm">
              {Icon && <Icon className="w-5 h-5 text-gray-500" />}
              <input
                type="text"
                value={searchQuery[field.name] || ""}
                onChange={(e) =>
                  handleAutocomplete(field.name, e.target.value, field)
                }
                placeholder={field.placeholder}
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-3 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(field.name, suggestion)}
                    className="px-5 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
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
              <div className="max-w-xl mx-auto">
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
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:border-purple-600 outline-none shadow-sm"
                />
              </div>
            )}

            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedValues.map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <div
                      key={val}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2 border border-gray-300"
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
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4">
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
                    className={`relative p-6 border-2 rounded-2xl text-center transition-all min-w-[160px] ${
                      isSelected
                        ? "border-black bg-white shadow-md"
                        : "border-gray-300 bg-white hover:border-gray-400 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {option.icon && (
                        <div className="w-24 h-24 flex items-center justify-center">
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
                              e.currentTarget.parentElement!.innerHTML = `<span class="text-4xl">${option.icon}</span>`;
                            }}
                          />
                        </div>
                      )}
                      <div className="font-semibold text-gray-800 text-lg">
                        {option.label}
                      </div>
                      <div
                        className={`w-5 h-5 border-2 rounded ${
                          isSelected
                            ? "bg-black border-black"
                            : "border-gray-300 bg-white"
                        } flex items-center justify-center`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
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
          </div>
        );
      }

      case "singleselect": {
        const selectedValue = formData[field.name];

        return (
          <div className="space-y-6">
            {field.label === "Project Type" ? (
              <div className="flex flex-wrap justify-center gap-4">
                {field.options?.map((option) => {
                  const isSelected = selectedValue === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleFieldChange(field.name, option.value)
                      }
                      className={`relative p-6 border-2 rounded-2xl text-center transition-all min-w-[200px] ${
                        isSelected
                          ? "border-black bg-white shadow-md"
                          : "border-gray-300 bg-white hover:border-gray-400 shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-32 h-32 flex items-center justify-center">
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
                        <div className="font-semibold text-gray-800 text-lg">
                          {option.label}
                        </div>
                        <div
                          className={`w-5 h-5 border-2 rounded ${
                            isSelected
                              ? "bg-black border-black"
                              : "border-gray-300 bg-white"
                          } flex items-center justify-center`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
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
              <div className="flex flex-wrap justify-center gap-3">
                {field.options?.map((option) => {
                  const isSelected = selectedValue === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleFieldChange(field.name, option.value)
                      }
                      className={`px-6 py-3 border-2 rounded-xl font-medium transition-all ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
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

        const formatFn =
          field.formatValue || ((v: number) => `${v.toLocaleString()}`);

        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-center items-center gap-6">
              <div className="flex-1 max-w-xs">
                <div className="border-2 border-gray-300 rounded-2xl p-5 bg-white shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">From</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {formatFn(rangeValue.min)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ₹{(rangeValue.min / 100000).toFixed(2)} Lac
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-xs">
                <div className="border-2 border-gray-300 rounded-2xl p-5 bg-white shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">To</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {formatFn(rangeValue.max)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ₹{(rangeValue.max / 10000000).toFixed(1)} Crs
                  </div>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={field.minValue}
              max={field.maxValue}
              value={rangeValue.min}
              onChange={(e) =>
                handleFieldChange(field.name, {
                  ...rangeValue,
                  min: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        {/* Inventory badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
            <Home className="w-5 h-5" />
            <span className="font-semibold">
              {inventoryCount} Inventory{" "}
              {currentStep === 0 ? "Available" : "Matched"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 max-w-3xl mx-auto leading-tight">
          {currentStepConfig.title}
        </h2>

        {/* Form fields */}
        <div className="space-y-8">
          {visibleFields.map((field) => (
            <div key={field.name} className="space-y-4">
              {field.label !== "Property Type" &&
                field.label !== "BHK Configuration" &&
                field.label !== "Project Type" &&
                field.label !== "Budget Range" && (
                  <label className="block text-sm font-semibold text-gray-700 text-center">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                )}
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-10">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex-1 px-8 py-3 rounded-xl text-lg font-medium ${
              isStepValid()
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } transition-colors`}
          >
            {currentStep === formConfig.steps.length - 1
              ? "Submit"
              : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;
