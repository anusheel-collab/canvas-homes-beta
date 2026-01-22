import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import hardHatIcon from "@/public/hard-hat.svg";
import { Manrope } from "next/font/google";

interface DeveloperFieldProps {
  field: any;
  formData: any;
  searchQuery: any;
  onFieldChange: (fieldName: string, value: any) => void;
  onSearchQueryChange: (fieldName: string, value: string) => void;
}

const manrope = Manrope({ subsets: ["latin"] });

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

  // NEW: Determine how many tags to show and if we need a "+N" indicator
  const MAX_VISIBLE_TAGS = 5;
  const visibleTags = selectedValues.slice(0, MAX_VISIBLE_TAGS);
  const remainingCount = selectedValues.length - MAX_VISIBLE_TAGS;
  const showRemainingIndicator = remainingCount > 0;

  // Top developers to show when dropdown is closed
  const topDevelopers = ["Prestige", "Embassy", "Sattva", "Assetz"];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    // Add a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleToggleDeveloper = (value: string) => {
    const isSelected = selectedValues.includes(value);
    onFieldChange(
      field.name,
      isSelected
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value],
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div className="w-full max-w-[480px] mx-auto">
        {/* MAIN INPUT CONTAINER */}
        <div className="relative w-full" ref={dropdownRef}>
          <div
            className="bg-[#FAFAFA] border border-[#D4D4D4] rounded-[6px] px-[16px] py-[4px] flex items-center gap-[12px] transition-all duration-300 ease-in-out"
            style={{ width: "480px", minHeight: "60px" }}
            id="search-container"
          >
            {/* ANIMATED LABEL */}
            <div
              className={`${manrope.className} font-medium transition-all duration-300 ease-in-out overflow-hidden absolute left-[52px] pointer-events-none`}
              style={{
                fontSize: hasSelections ? "12px" : "14px",
                color: hasSelections ? "#737373" : "#9CA3AF",
                top: hasSelections ? "4px" : "50%",
                opacity: hasSelections ? 1 : 0,
                transform: hasSelections ? "translateY(0)" : "translateY(-50%)",
              }}
            >
              Developers
            </div>

            {/* INPUT WITH TAGS INSIDE */}
            <div
              className="flex items-center gap-[8px] flex-wrap transition-[height] duration-300 ease-in-out w-full"
              style={{ paddingTop: hasSelections ? "20px" : "0" }}
            >
              <Image
                src={hardHatIcon}
                alt="Developers"
                width={24}
                height={24}
                className="flex-shrink-0"
              />

              {/* SELECTED TAGS INSIDE INPUT - LIMITED TO 5 */}
              {visibleTags.map((val) => {
                const opt = options.find((o: any) => o.value === val);
                return (
                  <div
                    key={val}
                    className={`inline-flex items-center gap-[6px] px-[8px] py-[6px] bg-[#F5F5F5] border-[1.5px] border-[#262626] rounded-[6px] ${manrope.className} text-[13px] font-medium flex-shrink-0`}
                    style={{
                      animation: "fadeIn 0.3s ease-in-out",
                    }}
                  >
                    <span className="text-[#262626]">{opt?.label}</span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleDeveloper(val);
                      }}
                      className="hover:opacity-70 border-none bg-[#F5F5F5] transition-opacity"
                    >
                      <X
                        className="w-[14px] h-[14px] text-[#262626]"
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                );
              })}

              {/* +N INDICATOR - Shows when more than 5 selections */}
              {showRemainingIndicator && (
                <span
                  className={`${manrope.className} text-[13px] font-medium text-[#262626] flex-shrink-0`}
                  style={{
                    animation: "fadeIn 0.3s ease-in-out",
                  }}
                >
                  +{remainingCount}
                </span>
              )}

              {/* SEARCH INPUT - READ ONLY */}
              <input
                type="text"
                value=""
                onFocus={() => setShowDropdown(true)}
                placeholder={
                  hasSelections ? "" : field.placeholder || "Developers"
                }
                className="flex-1 min-w-[120px] border-none outline-none font-manrope text-[14px] text-[#262626] placeholder:text-[#9CA3AF] bg-transparent cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {/* TOP DEVELOPERS SECTION - Shows when dropdown is CLOSED */}
          {!showDropdown && (
            <div className="mt-[16px]">
              <h3
                className={`${manrope.className} text-[#262626] text-[14px] font-semibold mb-[12px]`}
                style={{ lineHeight: "150%" }}
              >
                Top Developers for your Requirement
              </h3>
              <div className="flex flex-wrap gap-[8px]">
                {topDevelopers.map((devName) => {
                  const devOption = options.find(
                    (o: any) => o.label === devName,
                  );
                  const isSelected =
                    devOption && selectedValues.includes(devOption.value);

                  return (
                    <button
                      key={devName}
                      type="button"
                      onClick={() => {
                        if (devOption) {
                          handleToggleDeveloper(devOption.value);
                        }
                      }}
                      className={`px-[16px] py-[8px] rounded-[32px] border ${
                        manrope.className
                      } text-[14px] font-medium transition-all ${
                        isSelected
                          ? "bg-[#F5F5F5] text-[#262626] border-[#262626]"
                          : "bg-[#F5F5F5] text-[#262626] border-[#E5E5E5] hover:border-[#D4D4D4]"
                      }`}
                    >
                      {devName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DROPDOWN SUGGESTIONS */}
          {showDropdown && (
            <div className="absolute top-full left-[0px] w-[511px] mt-[8px] bg-white border-1 border-[#D4D4D4] rounded-[16px] shadow-lg z-50">
              {/* SEARCH INPUT INSIDE DROPDOWN - FIXED AT TOP */}
              <div className="bg-white p-[16px] pb-[12px] border-b-2 border-[#E5E5E5]">
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
                    className={`pl-[44px] pr-[12px] w-[423px] py-[12px] border border-[#E5E5E5] rounded-[8px] outline-none ${manrope.className} text-[14px] text-[#262626] placeholder:text-[#9CA3AF] bg-[#FAFAFA] focus:border-[#D4D4D4] transition-colors`}
                    autoFocus
                  />
                </div>
              </div>

              {/* SCROLLABLE SUGGESTIONS CONTAINER */}
              <div className="max-h-[350px] overflow-y-auto p-[16px] pt-[8px]">
                {/* SUGGESTIONS LIST */}
                {filteredOptions.length > 0 ? (
                  <div className="space-y-[4px]">
                    {filteredOptions.map((option: any) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <div
                          key={option.value}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleDeveloper(option.value);
                          }}
                          className={`flex items-center gap-[12px] px-[16px] py-[12px] cursor-pointer rounded-[8px] transition-colors ${
                            isSelected
                              ? "bg-[#F5F5F5] border border-[#262626]"
                              : "hover:bg-[#FAFAFA]"
                          }`}
                        >
                          {/* CHECKBOX */}
                          <div
                            className={`w-[24px] h-[24px] border-2 rounded-[6px] flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected
                                ? "bg-[#262626] border-[#262626] text-[#FAFAFA]"
                                : "border-[#D4D4D4] bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-[16px] h-[16px] text-white"
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
                            className={`${manrope.className} text-[#262626] font-medium text-[14px]`}
                          >
                            {option.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`text-center py-[24px] text-gray-400 ${manrope.className} text-[14px]`}
                  >
                    No developers found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeveloperField;
