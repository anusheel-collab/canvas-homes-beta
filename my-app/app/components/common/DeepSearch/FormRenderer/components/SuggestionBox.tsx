import React from "react";
import { MapPin } from "lucide-react";

interface SuggestionBoxProps {
  fieldName: string;
  showSuggestions: boolean;
  activeField: string | null;
  suggestions: string[];
  searchQuery: { [key: string]: string };
  isLocating: boolean;
  locationError: string | null;
  getCurrentLocation: () => void;
  onOpenMap: () => void;
  selectSuggestion: (fieldName: string, value: string) => void;
  onClose?: () => void;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  fieldName,
  showSuggestions,
  activeField,
  suggestions,
  searchQuery,
  isLocating,
  locationError,
  getCurrentLocation,
  onOpenMap,
  selectSuggestion,
  onClose,
}) => {
  if (!showSuggestions || activeField !== fieldName) return null;

  return (
    <div className="absolute left-0 z-10 w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-2 border border-[#D4D4D4] py-[4px] px-[16px] rounded-[6px]">
      {/* MAP SEARCH OPTION - ALWAYS SHOW AT TOP */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          // First, scroll to top to ensure modal opens centered
          window.scrollTo({ top: 0, behavior: "instant" });

          // Close suggestions
          onClose?.();

          // Force a small delay to ensure scroll completes
          setTimeout(() => {
            onOpenMap();
          }, 10);
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
          <span className="text-gray-800 font-semibold font-manrope text-[16px] text-[#262626]">
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
          <span className="text-gray-800 font-semibold font-manrope text-[16px] text-[#262626]">
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
              onClick={() => selectSuggestion(fieldName, suggestion)}
              className="group px-[8px] py-[10px] hover:bg-[#F5F5F5] cursor-pointer flex items-center gap-4 rounded-[6px] transition-colors"
            >
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-[8px] px-[12px] py-[12px] flex items-center justify-center group-hover:bg-[#D4D4D4] transition-colors">
                <MapPin className="w-5 h-5 stroke-[#525252]" />
              </div>

              <span className="text-gray-700 font-medium font-manrope text-[16px] text-[#262626] p-[8px]">
                {suggestion}
              </span>
            </div>
          ))}
        </>
      )}

      {/* EMPTY STATE MESSAGE WHEN NO SUGGESTIONS */}
      {suggestions.length === 0 && searchQuery[fieldName]?.length > 0 && (
        <div className="px-4 py-3 text-center text-gray-500">
          No locations found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default SuggestionBox;
