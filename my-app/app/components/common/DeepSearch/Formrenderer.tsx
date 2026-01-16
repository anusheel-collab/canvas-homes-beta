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

  // ADD THESE STATES FOR LOCATION FUNCTIONALITY
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".autocomplete-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================
  // CURRENT LOCATION HANDLER
  // ============================================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };

        setUserLocation(newLocation);
        setIsLocating(false);

        // Get the address from coordinates using reverse geocoding
        if (
          typeof google !== "undefined" &&
          google.maps &&
          google.maps.Geocoder
        ) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: newLocation }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              if (activeField) {
                handleFieldChange(activeField, address);
                setSearchQuery((prev) => ({ ...prev, [activeField]: address }));
                setShowSuggestions(false);
              }
            } else {
              // If geocoding fails, use coordinates
              const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(
                6
              )}`;
              if (activeField) {
                handleFieldChange(activeField, locationText);
                setSearchQuery((prev) => ({
                  ...prev,
                  [activeField]: locationText,
                }));
                setShowSuggestions(false);
              }
            }
          });
        } else {
          // Fallback if Google Geocoder not available
          const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(
            6
          )}`;
          if (activeField) {
            handleFieldChange(activeField, locationText);
            setSearchQuery((prev) => ({
              ...prev,
              [activeField]: locationText,
            }));
            setShowSuggestions(false);
          }
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access denied. Please enable location services."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Auto-clear location errors after 5 seconds
  useEffect(() => {
    if (locationError) {
      const timer = setTimeout(() => {
        setLocationError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [locationError]);

  // In FormRenderer.tsx, update the handleAutocomplete function:

  const handleAutocomplete = async (
    fieldName: string,
    query: string,
    field: FormField
  ) => {
    setSearchQuery((prev) => ({ ...prev, [fieldName]: query }));
    setActiveField(fieldName);

    // Always show special options when field is active
    if (activeField === fieldName) {
      setShowSuggestions(true);
    }

    // Fetch Google suggestions only if query is not empty
    if (query.length > 0 && field.getSuggestions) {
      try {
        const results = await field.getSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
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
          <div className="relative w-full max-w-[470px] mx-auto autocomplete-container">
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
                  setShowSuggestions(true); // Always show special options on focus

                  // Only fetch suggestions if there's already text in the input
                  if (
                    searchQuery[field.name]?.length > 0 &&
                    field.getSuggestions
                  ) {
                    field
                      .getSuggestions(searchQuery[field.name])
                      .then((results) => setSuggestions(results))
                      .catch((error) => {
                        console.error("Error fetching suggestions:", error);
                        setSuggestions([]);
                      });
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

            {/* SHOW SUGGESTIONS WHEN FIELD IS ACTIVE (CLICKED/FOCUSED) */}
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

                {/* MY LOCATION OPTION */}
                <div
                  onClick={() => !isLocating && getCurrentLocation()}
                  className={`group px-[8px] py-[10px] flex items-center gap-4 rounded-[6px] transition-colors border-b border-gray-100 ${
                    isLocating
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-[#F5F5F5] cursor-pointer"
                  }`}
                >
                  <div className="w-10 h-10 bg-green-50 rounded-[8px] px-[12px] py-[12px] flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    {isLocating ? (
                      <div className="w-5 h-5 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-5 h-5 stroke-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
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
                      {isLocating
                        ? "Getting your location..."
                        : "Use My Current Location"}
                    </span>
                    <span className="text-sm text-gray-500 mt-0.5">
                      {isLocating
                        ? "Please wait..."
                        : "Automatically detect your location"}
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

                {/* LOCATION ERROR MESSAGE */}
                {locationError && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg mx-4 my-2">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-red-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-red-700 font-medium">
                        {locationError}
                      </span>
                    </div>
                  </div>
                )}

                {/* REGULAR SUGGESTIONS (ONLY SHOW WHEN USER HAS TYPED) */}
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

                {/* EMPTY STATE MESSAGE WHEN NO SUGGESTIONS */}
                {suggestions.length === 0 &&
                  searchQuery[field.name]?.length > 0 && (
                    <div className="px-4 py-3 text-center text-gray-500">
                      No locations found. Try a different search term.
                    </div>
                  )}
              </div>
            )}
          </div>
        );
      // ============================================
      // PROPERTY TYPE & DEVELOPER PAGES - MULTISELECT FIELDS
      // ============================================
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
            {/* DEVELOPER SEARCH (MULTISELECT-SEARCH) */}
            {isSearchable && (
              <div
                className="max-w-[448px] mx-auto bg-white border-2 rounded-2xl p-3"
                style={{ borderColor: "#D4D4D4" }}
              >
                {/* SELECTED DEVELOPERS TAGS */}
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
                      {/* <img
                        src="/home.svg"
                        alt="Developers"
                        className="w-5 h-5"
                      /> */}
                      {/* <span>Developers</span> */}
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

                {/* DEVELOPER SEARCH INPUT */}
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

                {/* DEVELOPER OPTIONS LIST */}
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
                        {/* CHECKBOX FOR DEVELOPER SELECTION */}
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

                        {/* DEVELOPER NAME */}
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

            {/* PROPERTY TYPE SELECTION (MULTISELECT - VISUAL) */}
            {!isSearchable && (
              <div
                className="flex flex-wrap justify-center"
                style={{
                  gap: "24px",
                  maxWidth: "calc(3 * 168px + 2 * 24px)", // Maximum width for 3 items
                  margin: "0 auto", // Center the container
                }}
              >
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
                        backgroundColor: "#FAFAFA",
                        paddingTop: "12px",
                        paddingBottom: "20px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        border: isSelected
                          ? "1px solid #000000"
                          : "1px solid #A3A3A3", // 1px border

                        borderRadius: "16px",
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        {/* PROPERTY TYPE ICON */}
                        {option.icon && (
                          <div className="w-[165px] h-[120px] flex items-center justify-center">
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
                                  : option.value === "rowHouses"
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

                        {/* PROPERTY TYPE LABEL */}
                        <div
                          className="font-semibold text-gray-800"
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontSize: "18px",
                            fontWeight: 600,
                            width: "168px",
                            height: "36px",
                          }}
                        >
                          {option.label}
                        </div>

                        {/* SELECTION CHECKBOX */}
                        <Checkbox
                          checked={isSelected}
                          onChange={() =>
                            handleFieldChange(
                              field.name,
                              isSelected
                                ? selectedValues.filter(
                                    (v) => v !== option.value
                                  )
                                : [...selectedValues, option.value]
                            )
                          }
                          size="small"
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": {
                              color: "#000000",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: 29,
                            },
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      // ============================================
      // POSSESSION BY & PROJECT TYPE PAGES - SINGLE SELECT FIELDS
      // ============================================
      case "singleselect": {
        const selectedValue = formData[field.name];

        return (
          <div className="space-y-6">
            {/* PROJECT TYPE SELECTION (VISUAL CARDS) */}
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
                        {/* PROJECT TYPE ICON */}
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

                        {/* PROJECT TYPE LABEL */}
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

                        {/* SELECTION RADIO BUTTON */}
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
              /* POSSESSION BY SELECTION (BUTTONS) */
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

      // ============================================
      // BUDGET & PLOT SIZE PAGES - RANGE SLIDER FIELDS
      // ============================================
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
            {/* RANGE SLIDER */}
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

            {/* MIN AND MAX VALUE INPUTS */}
            <div className="flex items-center justify-center gap-6">
              {/* MIN VALUE INPUT */}
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
                    {/* Conditional display for min value */}
                    {field.name === "plotSize"
                      ? `Sqft`
                      : field.name === "budget"
                      ? rangeValue.min >= 10000000
                        ? `₹${(rangeValue.min / 10000000).toFixed(2)} Cr`
                        : `₹${(rangeValue.min / 100000).toFixed(2)} Lac`
                      : `₹${(rangeValue.min / 100000).toFixed(2)} Lac`}
                  </div>
                </div>
              </div>

              {/* MAX VALUE INPUT */}
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
                    {/* Conditional display for max value */}
                    {field.name === "plotSize"
                      ? `Sqft`
                      : field.name === "budget"
                      ? rangeValue.max >= 10000000
                        ? `₹${(rangeValue.max / 10000000).toFixed(2)} Cr`
                        : `₹${(rangeValue.max / 100000).toFixed(2)} Lac`
                      : `₹${(rangeValue.max / 100000).toFixed(2)} Lac`}
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
