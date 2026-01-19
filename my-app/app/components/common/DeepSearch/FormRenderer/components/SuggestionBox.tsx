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
    <div
      className="absolute left-0 z-10 mt-[12px] w-[416px] max-h-[306px] overflow-y-auto bg-[#FAFAFA] rounded-2xl shadow-xl border border-[#D4D4D4] py-[16px] px-[16px]"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#D9D9D9 #F5F5F5",
      }}
    >
      <style jsx>{`
        /* Custom scrollbar for Webkit browsers */
        div::-webkit-scrollbar {
          width: 6px;
          height: 96px;
        }
        div::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 16px;
        }
        div::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 16px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #a3a3a3;
        }
      `}</style>
      <div className="text-[12px] text-[#525252] font-medium">
        Suggestive Searches
      </div>
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
        className="group px-[8px] py-[10px] hover:bg-[#F5F5F5] cursor-pointer flex items-center gap-4 rounded-[6px] transition-colors border-gray-100"
      >
        <div className="w-10 h-10 bg-[#F5F5F5] rounded-[8px] px-[12px] py-[12px] flex items-center justify-center group-hover:bg-[#D4D4D4] transition-colors">
          <img src="/pointer.svg" alt="Draw on map" className="w-5 h-5" />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-semibold pl-[8px] font-manrope text-[16px] text-[#262626]">
            Draw the location
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
        className={`group px-[8px] py-[10px] flex items-center gap-4 rounded-[6px] transition-colors border-gray-100 ${
          isLocating
            ? "cursor-not-allowed opacity-60"
            : "hover:bg-[#F5F5F5] cursor-pointer"
        }`}
      >
        <div className="w-10 h-10 bg-[#F5F5F5] rounded-[8px] px-[12px] py-[12px] flex items-center justify-center group-hover:bg-[#D4D4D4] transition-colors">
          {isLocating ? (
            <div className="w-5 h-5 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
          ) : (
            <img src="/locate.svg" alt="Locate" className="w-5 h-5" />
          )}
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-gray-800 pl-[8px] font-semibold font-manrope text-[16px] text-[#262626]">
            {isLocating
              ? "Getting your location..."
              : "Use My Current Location"}
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
          <div className="px-4 py-2 bg-gray-50"></div>
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
