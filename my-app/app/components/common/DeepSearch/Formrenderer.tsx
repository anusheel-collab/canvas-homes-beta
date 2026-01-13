"use client";

import React, { useState, useMemo } from "react";
import { MapPin, X } from "lucide-react";
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
          <div className="relative w-full">
            <div className="flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl focus-within:border-purple-600 bg-white transition-colors">
              {Icon && <Icon className="w-5 h-5 text-gray-400" />}
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
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(field.name, suggestion)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{suggestion}</span>
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
          <div className="w-full space-y-4">
            {isSearchable && (
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 outline-none"
              />
            )}

            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <div
                      key={val}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon && (
                        <span className="text-3xl">{option.icon}</span>
                      )}
                      <div className="flex-1 font-semibold text-gray-800">
                        {option.label}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {field.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFieldChange(field.name, option.value)}
                className={`px-4 py-3 border-2 rounded-xl font-medium ${
                  selectedValue === option.value
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      }

      case "range": {
        const rangeValue = formData[field.name] || {
          min: field.minValue,
          max: field.maxValue,
        };

        const formatFn =
          field.formatValue || ((v: number) => `${v} ${field.unit}`);

        return (
          <div className="flex gap-4">
            {["min", "max"].map((key) => (
              <input
                key={key}
                type="number"
                value={rangeValue[key]}
                onChange={(e) =>
                  handleFieldChange(field.name, {
                    ...rangeValue,
                    [key]: parseInt(e.target.value),
                  })
                }
                className="flex-1 px-4 py-3 border-2 rounded-xl"
              />
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
          {currentStepConfig.title}
        </h2>

        <div className="space-y-6">
          {visibleFields.map((field) => (
            <div key={field.name} className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
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
