import React from "react";
import { MapModal } from "../../MapModal";
import { MapPreview } from "../../MapPreview";
import SuggestionBox from "../components/SuggestionBox";

// ============================================
// COMPLETE PROPS INTERFACE
// ============================================
interface LocationFieldProps {
  field: any;
  formData: any;
  searchQuery: any;
  suggestions: string[];
  showSuggestions: boolean;
  activeField: string | null;
  showMapModal: boolean;
  isLocating: boolean;
  locationError: string | null;
  selectedLocation: any;
  selectedRadius: number;
  showMapPreview: boolean;
  currentStep: number;
  onFieldChange: (fieldName: string, value: any) => void;
  onSearchQueryChange: (fieldName: string, value: string) => void;
  onAutocomplete: (
    fieldName: string,
    query: string,
    field: any,
  ) => Promise<void>;
  onSelectSuggestion: (fieldName: string, value: string) => void;
  onGetCurrentLocation: () => void;
  onSetShowMapModal: (show: boolean) => void;
  onSetShowSuggestions: (show: boolean) => void;
  onHandleMapSelection: (selectedArea: any) => void;
  onHandleInputFocus: () => void;
  onSetSelectedRadius: (radius: number) => void;
}

const LocationField: React.FC<LocationFieldProps> = ({
  field,
  formData,
  searchQuery,
  suggestions, // <-- MAKE SURE THIS IS IN THE DESTRUCTURING
  showSuggestions,
  activeField,
  showMapModal,
  isLocating,
  locationError,
  selectedLocation,
  selectedRadius,
  showMapPreview,
  currentStep,
  onFieldChange,
  onSearchQueryChange,
  onAutocomplete,
  onSelectSuggestion,
  onGetCurrentLocation,
  onSetShowMapModal,
  onSetShowSuggestions,
  onHandleMapSelection,
  onHandleInputFocus,
  onSetSelectedRadius,
}) => {
  const Icon = field.icon;

  return (
    <>
      <div className="relative w-full max-w-[448px] mx-auto autocomplete-container">
        <div className="flex items-center gap-3 bg-white border border-[#D4D4D4] py-[10px] px-[16px] rounded-[6px] transition-colors">
          {Icon && <Icon className="w-5 h-5 text-[#737373]" />}

          <input
            type="text"
            value={searchQuery[field.name] || ""}
            onChange={(e) => onAutocomplete(field.name, e.target.value, field)}
            onFocus={() => {
              onSetShowSuggestions(true);
              onHandleInputFocus();

              // Only fetch suggestions if there's already text in the input
              if (searchQuery[field.name]?.length > 0 && field.getSuggestions) {
                field
                  .getSuggestions(searchQuery[field.name])
                  .then(() => {})
                  .catch((error: any) => {
                    console.error("Error fetching suggestions:", error);
                  });
              }
            }}
            placeholder={field.placeholder}
            className="flex-1 outline-none text-gray-800 placeholder:text-[#737373] font-manrope text-[14px] font-normal py-[12px] bg-[#FAFAFA]"
            style={{
              border: "none",
            }}
          />
        </div>

        {/* SUGGESTION BOX COMPONENT */}
        <SuggestionBox
          fieldName={field.name}
          showSuggestions={showSuggestions}
          activeField={activeField}
          suggestions={suggestions} // <-- THIS IS PASSING THE suggestions prop
          searchQuery={searchQuery}
          isLocating={isLocating}
          locationError={locationError}
          getCurrentLocation={onGetCurrentLocation}
          onOpenMap={() => onSetShowMapModal(true)}
          selectSuggestion={onSelectSuggestion}
          onClose={() => onSetShowSuggestions(false)}
        />
      </div>

      {/* MAP PREVIEW - SHOW WHEN LOCATION IS SELECTED AND ON LOCATION PAGE */}
      {currentStep === 0 && showMapPreview && selectedLocation && (
        <div className="mt-8 flex flex-col items-center">
          <MapPreview
            location={selectedLocation}
            radius={selectedRadius}
            onRadiusChange={onSetSelectedRadius}
            onOpenMap={() => onSetShowMapModal(true)}
            width={480}
            height={280}
          />

          {/* Selection Info */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Selected:{" "}
              <span className="font-medium">{selectedLocation.address}</span>
              {selectedLocation.type === "current" &&
                " (Your Current Location)"}
              {selectedLocation.type === "map" && " (Custom Drawn Area)"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedRadius}km radius • Click "Draw" to modify area
            </p>
          </div>
        </div>
      )}

      {/* MAP MODAL */}
      {currentStep === 0 && (
        <MapModal
          isOpen={showMapModal}
          onClose={() => onSetShowMapModal(false)}
          onMapSelect={onHandleMapSelection}
        />
      )}
    </>
  );
};

export default LocationField;
