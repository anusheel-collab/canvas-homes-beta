import React, { useState } from "react";
import { X } from "lucide-react";

interface DeveloperFieldProps {
  field: any;
  formData: any;
  searchQuery: any;
  onFieldChange: (fieldName: string, value: any) => void;
  onSearchQueryChange: (fieldName: string, value: string) => void;
}

const DeveloperField: React.FC<DeveloperFieldProps> = ({
  field,
  formData,
  searchQuery,
  onFieldChange,
  onSearchQueryChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const options = field.filterOptions
    ? field.filterOptions(field.options || [], formData)
    : field.options || [];

  const selectedValues: string[] = formData[field.name] || [];
  const searchTerm = searchQuery[field.name] || "";

  const filteredOptions = searchTerm
    ? options.filter((opt: any) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  const hasSelections = selectedValues.length > 0;

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="w-full max-w-[448px] sm:max-w-[625px] lg:max-w-[900px] mx-auto">
      {/* MAIN INPUT CONTAINER */}
      <div className="relative w-full" ref={dropdownRef}>
        <div
          className="bg-white border-2 border-[#D4D4D4] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-[16px] sm:p-[20px] lg:p-[24px] transition-colors"
          style={{ width: "100%" }}
          id="search-container"
        >
          {/* LABEL - Shows "Developers" when there are selections */}
          {hasSelections && (
            <div className="text-[#737373] font-manrope text-[12px] sm:text-[13px] font-medium mb-[8px]">
              Developers
            </div>
          )}

          {/* INPUT WITH TAGS INSIDE */}
          <div className="flex items-center gap-[8px] flex-wrap">
            {/* SEARCH ICON */}
            <svg
              className="w-[24px] h-[24px] text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path
                d="m21 21-4.35-4.35"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* SELECTED TAGS INSIDE INPUT */}
            {selectedValues.map((val) => {
              const opt = options.find((o: any) => o.value === val);
              return (
                <div
                  key={val}
                  className="inline-flex items-center gap-[6px] px-[10px] py-[4px] sm:px-[12px] sm:py-[6px] bg-white border-2 border-black rounded-lg font-manrope text-[13px] sm:text-[14px] font-medium flex-shrink-0"
                >
                  <span>{opt?.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFieldChange(
                        field.name,
                        selectedValues.filter((v) => v !== val),
                      );
                    }}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" />
                  </button>
                </div>
              );
            })}

            {/* SEARCH INPUT - READ ONLY */}
            <input
              type="text"
              value=""
              onFocus={() => setShowDropdown(true)}
              placeholder={
                hasSelections ? "" : field.placeholder || "Developers"
              }
              className="flex-1 min-w-[120px] border-none outline-none font-manrope text-[14px] sm:text-[15px] lg:text-[16px] text-gray-800 placeholder:text-gray-400 bg-transparent cursor-pointer"
              readOnly
            />
          </div>
        </div>

        {/* DROPDOWN SUGGESTIONS */}
        {showDropdown && (
          <div
            className="absolute top-full left-[0px] right-[0px] mt-[8px] bg-white border-2 border-[#D4D4D4] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] shadow-lg z-50"
          >
            {/* SEARCH INPUT INSIDE DROPDOWN - FIXED AT TOP */}
            <div className="bg-white p-[16px] sm:p-[20px] pb-[16px] border-b-2 border-[#E5E5E5]">
              <div className="relative">
                <svg
                  className="absolute left-[12px] top-[50%] translate-y-[-50%] w-[20px] h-[20px] text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path
                    d="m21 21-4.35-4.35"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    onSearchQueryChange(field.name, e.target.value)
                  }
                  placeholder="Search Developer"
                  className="w-full pl-[44px] pr-[16px] py-[12px] border-2 border-[#D4D4D4] rounded-[12px] outline-none font-manrope text-[14px] sm:text-[15px] text-gray-800 placeholder:text-gray-400 focus:border-gray-400 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* SCROLLABLE SUGGESTIONS CONTAINER */}
            <div className="max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] overflow-y-auto p-[16px] sm:p-[20px] pt-[0px]">
              {/* SUGGESTIONS LIST */}
              {filteredOptions.length > 0 ? (
                <div className="space-y-[4px] pt-[16px]">
                  {filteredOptions.map((option: any) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onFieldChange(
                            field.name,
                            isSelected
                              ? selectedValues.filter((v) => v !== option.value)
                              : [...selectedValues, option.value],
                          );
                        }}
                        className="flex items-center gap-[12px] sm:gap-[16px] px-[12px] sm:px-[16px] py-[12px] sm:py-[14px] hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                      >
                        {/* CHECKBOX */}
                        <div
                          className={`w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] border-2 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected
                              ? "bg-black border-black"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px] text-white"
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
                        <span className="text-gray-800 font-medium font-manrope text-[14px] sm:text-[15px] lg:text-[16px]">
                          {option.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-[24px] text-gray-400 font-manrope text-[14px]">
                  No developers found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperField;

