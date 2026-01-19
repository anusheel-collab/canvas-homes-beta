import { useState, useMemo, useEffect, useCallback } from "react";
import { formConfig, FormField, FormStep } from "../../formConfig"; // Fixed path
import { FormLogicReturn, FormLogicState } from "../types"; // Fixed path

export const useFormLogic = (
  currentStep: number,
  onValidationChange?: (isValid: boolean) => void,
  onFormDataUpdate?: (formData: any) => void,
): FormLogicReturn => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [formData, setFormData] = useState<FormLogicState["formData"]>({});
  const [suggestions, setSuggestions] = useState<FormLogicState["suggestions"]>(
    [],
  );
  const [showSuggestions, setShowSuggestions] =
    useState<FormLogicState["showSuggestions"]>(false);
  const [searchQuery, setSearchQuery] = useState<FormLogicState["searchQuery"]>(
    {},
  );

  // STATES FOR MAP MODAL
  const [showMapModal, setShowMapModal] =
    useState<FormLogicState["showMapModal"]>(false);
  const [activeField, setActiveField] =
    useState<FormLogicState["activeField"]>(null);

  // STATES FOR LOCATION FUNCTIONALITY
  const [userLocation, setUserLocation] =
    useState<FormLogicState["userLocation"]>(null);
  const [isLocating, setIsLocating] =
    useState<FormLogicState["isLocating"]>(false);
  const [locationError, setLocationError] =
    useState<FormLogicState["locationError"]>(null);

  // STATES FOR MAP PREVIEW
  const [selectedLocation, setSelectedLocation] =
    useState<FormLogicState["selectedLocation"]>(null);
  const [selectedRadius, setSelectedRadius] =
    useState<FormLogicState["selectedRadius"]>(2);
  const [showMapPreview, setShowMapPreview] =
    useState<FormLogicState["showMapPreview"]>(false);

  // ============================================
  // MEMOIZED CALCULATIONS
  // ============================================

  const getVisibleSteps = useMemo(() => {
    return formConfig.steps.filter((step) => {
      if (!step.condition) return true;
      return step.condition(formData);
    });
  }, [formData]);

  const currentVisibleStep = getVisibleSteps[currentStep];
  const currentStepConfig = currentVisibleStep;
  const totalVisibleSteps = getVisibleSteps.length;

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
  // DYNAMIC TITLE HANDLING
  // ============================================

  const getStepTitle = useCallback(
    (step: FormStep | undefined) => {
      if (!step) return "";
      if (typeof step.title === "function") {
        return step.title(formData);
      }
      return step.title || "";
    },
    [formData],
  );

  const currentTitle = getStepTitle(currentStepConfig);

  // ============================================
  // VALIDATION LOGIC
  // ============================================

  const isStepValid = useMemo(() => {
    if (!currentStepConfig) return false;

    // Check if this is the location step
    if (currentStepConfig.id === "location") {
      // For location step, require a selected location to show map preview
      return !!selectedLocation && !!formData["location"];
    }

    // For other steps, use original validation
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
  }, [visibleFields, formData, currentStepConfig, selectedLocation]);

  // ============================================
  // INVENTORY COUNT DISPLAY LOGIC
  // ============================================

  const inventoryCount = useMemo(() => {
    return currentStep === 0
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
  }, [currentStep]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      const newFormData = { ...formData, [fieldName]: value };
      setFormData(newFormData);
    },
    [formData],
  );

  const handleAutocomplete = useCallback(
    async (fieldName: string, query: string, field: FormField) => {
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
    },
    [activeField],
  );

  const selectSuggestion = useCallback(
    (fieldName: string, value: string) => {
      handleFieldChange(fieldName, value);
      setSearchQuery((prev) => ({ ...prev, [fieldName]: value }));
      setShowSuggestions(false);
      setSuggestions([]);

      // Set selected location for map preview
      // For suggestions, we need to geocode the address to get coordinates
      if (
        typeof google !== "undefined" &&
        google.maps &&
        google.maps.Geocoder
      ) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: value }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            setSelectedLocation({
              lat: location.lat(),
              lng: location.lng(),
              address: value,
              type: "suggestion",
            });
            setShowMapPreview(true);
          } else {
            // Fallback to default coordinates
            setSelectedLocation({
              lat: 12.9716,
              lng: 77.5946,
              address: value,
              type: "suggestion",
            });
            setShowMapPreview(true);
          }
        });
      } else {
        // Fallback if geocoder not available
        setSelectedLocation({
          lat: 12.9716,
          lng: 77.5946,
          address: value,
          type: "suggestion",
        });
        setShowMapPreview(true);
      }
    },
    [handleFieldChange],
  );

  const handleMapSelection = useCallback(
    (selectedArea: any) => {
      console.log("Selected area from map:", selectedArea);

      if (activeField) {
        const displayName = selectedArea.area || "Custom Drawn Area";

        // Update the form field with the selected area
        handleFieldChange(activeField, displayName);

        // Update search query to show the selected area
        setSearchQuery((prev) => ({
          ...prev,
          [activeField]: displayName,
        }));

        // Set selected location for map preview
        // Calculate center of drawn polygon for preview
        const coordinates = selectedArea.coordinates || [];
        let centerLat = 12.9716;
        let centerLng = 77.5946;

        if (coordinates.length > 0) {
          const sum = coordinates.reduce(
            (acc: any, coord: any) => {
              return { lat: acc.lat + coord.lat, lng: acc.lng + coord.lng };
            },
            { lat: 0, lng: 0 },
          );

          centerLat = sum.lat / coordinates.length;
          centerLng = sum.lng / coordinates.length;
        }

        setSelectedLocation({
          lat: centerLat,
          lng: centerLng,
          address: displayName,
          type: "map",
        });
        setShowMapPreview(true);
      }

      setShowMapModal(false);
      setShowSuggestions(false);
    },
    [activeField, handleFieldChange],
  );

  const handleInputFocus = useCallback(() => {
    setActiveField("location");
    setShowSuggestions(true);
    setShowMapPreview(false);
  }, []);

  const getCurrentLocation = useCallback(() => {
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

                // Set selected location for map preview
                setSelectedLocation({
                  lat: latitude,
                  lng: longitude,
                  address: address,
                  type: "current",
                });
                setShowMapPreview(true);
              }
            } else {
              // If geocoding fails, use coordinates
              const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(
                6,
              )}`;
              if (activeField) {
                handleFieldChange(activeField, locationText);
                setSearchQuery((prev) => ({
                  ...prev,
                  [activeField]: locationText,
                }));
                setShowSuggestions(false);

                // Set selected location for map preview
                setSelectedLocation({
                  lat: latitude,
                  lng: longitude,
                  address: locationText,
                  type: "current",
                });
                setShowMapPreview(true);
              }
            }
          });
        } else {
          // Fallback if Google Geocoder not available
          const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(
            6,
          )}`;
          if (activeField) {
            handleFieldChange(activeField, locationText);
            setSearchQuery((prev) => ({
              ...prev,
              [activeField]: locationText,
            }));
            setShowSuggestions(false);

            // Set selected location for map preview
            setSelectedLocation({
              lat: latitude,
              lng: longitude,
              address: locationText,
              type: "current",
            });
            setShowMapPreview(true);
          }
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access denied. Please enable location services.",
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
      },
    );
  }, [activeField, handleFieldChange]);

  // ============================================
  // EFFECTS
  // ============================================

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

  // Auto-clear location errors after 5 seconds
  useEffect(() => {
    if (locationError) {
      const timer = setTimeout(() => {
        setLocationError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [locationError]);

  // Reset map preview when leaving location page
  useEffect(() => {
    if (currentStep !== 0) {
      setShowMapPreview(false);
    }
  }, [currentStep]);

  // Reset modal state when leaving location page
  useEffect(() => {
    if (currentStep !== 0) {
      setShowMapModal(false);
      setActiveField(null);
      setShowSuggestions(false);
    }
  }, [currentStep]);

  // Force modal to open at center of viewport
  useEffect(() => {
    if (showMapModal && currentStep === 0) {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        document.body.style.overflow = "hidden";
      });
    }
  }, [showMapModal, currentStep]);

  // Handle modal opening specifically for the location field
  useEffect(() => {
    if (showMapModal && currentStep === 0) {
      const timer = setTimeout(() => {
        // This triggers a re-render to ensure GoogleMapContainer loads
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showMapModal, currentStep]);

  // Effects for parent communication
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
  // RETURN ALL STATES AND HANDLERS
  // ============================================

  return {
    // States
    formData,
    searchQuery,
    suggestions,
    showSuggestions,
    showMapModal,
    activeField,
    userLocation,
    isLocating,
    locationError,
    selectedLocation,
    selectedRadius,
    showMapPreview,

    // Setters
    setFormData,
    setSearchQuery,
    setSuggestions,
    setShowSuggestions,
    setShowMapModal,
    setActiveField,
    setUserLocation,
    setIsLocating,
    setLocationError,
    setSelectedLocation,
    setSelectedRadius,
    setShowMapPreview,

    // Handlers
    handleFieldChange,
    handleAutocomplete,
    selectSuggestion,
    handleMapSelection,
    handleInputFocus,
    getCurrentLocation,

    // Computed values
    isStepValid,
    currentVisibleStep,
    currentStepConfig,
    totalVisibleSteps,
    visibleFields,
    currentTitle,
    inventoryCount,
  };
};
