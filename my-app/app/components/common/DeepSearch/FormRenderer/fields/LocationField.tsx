import React from "react";
import { MapModal } from "../../MapModal";
import { MapPreview } from "../../MapPreview";
import SuggestionBox from "../components/SuggestionBox";

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
  suggestions,
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
      <div className="relative w-full mx-auto autocomplete-container">
        <div className="flex items-center gap-2 sm:gap-3 bg-[#FAFAFA] border border-[#D4D4D4] py-[8px] md:py-[10px] px-[12px] md:px-[16px] rounded-[6px] transition-colors w-[362px] md:w-[448px] h-[60px] md:h-[52px] mx-auto">
          {Icon && (
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#737373] flex-shrink-0" />
          )}

          <input
            type="text"
            value={searchQuery[field.name] || ""}
            onChange={(e) => onAutocomplete(field.name, e.target.value, field)}
            onFocus={() => {
              onSetShowSuggestions(true);
              onHandleInputFocus();

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
            className="flex-1 outline-none text-gray-800 placeholder:text-[#737373] font-manrope text-[12px] sm:text-[14px] font-normal py-[10px] sm:py-[12px] bg-[#FAFAFA] min-w-0"
            style={{
              border: "none",
            }}
          />
        </div>

        <SuggestionBox
          fieldName={field.name}
          showSuggestions={showSuggestions}
          activeField={activeField}
          suggestions={suggestions}
          searchQuery={searchQuery}
          isLocating={isLocating}
          locationError={locationError}
          getCurrentLocation={onGetCurrentLocation}
          onOpenMap={() => onSetShowMapModal(true)}
          selectSuggestion={onSelectSuggestion}
          onClose={() => onSetShowSuggestions(false)}
        />
      </div>

      {currentStep === 0 && showMapPreview && selectedLocation && (
        <div className="mt-6 sm:mt-8 flex flex-col items-center px-4">
          <MapPreview
            location={selectedLocation}
            radius={selectedRadius || 5}
            onRadiusChange={onSetSelectedRadius}
            onOpenMap={() => onSetShowMapModal(true)}
            width={480}
            height={280}
          />
        </div>
      )}

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
