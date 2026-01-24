import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { X } from "lucide-react";

interface MultiSelectFieldProps {
  field: any;
  formData: any;
  searchQuery: any;
  isSearchable?: boolean;
  visualMode?: boolean;
  onFieldChange: (fieldName: string, value: any) => void;
  onSearchQueryChange: (fieldName: string, value: string) => void;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  field,
  formData,
  searchQuery,
  isSearchable = false,
  visualMode = false,
  onFieldChange,
  onSearchQueryChange,
}) => {
  const options = field.filterOptions
    ? field.filterOptions(field.options || [], formData)
    : field.options || [];

  const selectedValues: string[] = formData[field.name] || [];
  const searchTerm = searchQuery[field.name] || "";

  const filteredOptions =
    isSearchable && searchTerm
      ? options.filter((opt: any) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : options;

  if (visualMode) {
    return (
      <div className="flex flex-wrap justify-center gap-[16px] md:gap-[20px] lg:gap-[24px] max-w-[calc(2*137px+1*16px)] md:max-w-[calc(3*168px+2*20px)] lg:max-w-[calc(3*168px+2*24px)] mx-auto">
        {filteredOptions.map((option: any) => {
          const isSelected = selectedValues.includes(option.value);

          return (
            <button
              key={option.value}
              onClick={() =>
                onFieldChange(
                  field.name,
                  isSelected
                    ? selectedValues.filter((v) => v !== option.value)
                    : [...selectedValues, option.value],
                )
              }
              className={`relative text-center transition-all bg-[#FAFAFA] px-[8px] md:px-[10px] lg:px-[12px] rounded-[12px] md:rounded-[14px] lg:rounded-[16px] w-[137px] md:w-[168px] lg:w-[168px] h-[138px] md:h-[155px] lg:h-[197px] ${
                isSelected
                  ? "border-2 border-black"
                  : "border-2 border-[#A3A3A3]"
              }`}
            >
              <div className="flex flex-col items-center gap-0 h-full justify-between py-[6px] md:py-[8px] lg:py-[10px]">
                {/* ICON */}
                {option.icon && (
                  <div className="w-[113px] h-[80px] md:w-[140px] md:h-[100px] lg:w-[140px] lg:h-[100px] flex items-center justify-center">
                    {option.icon}
                  </div>
                )}

                {/* LABEL */}
                <div className="font-manrope text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-gray-800 flex items-center justify-center px-1">
                  {option.label}
                </div>

                {/* SELECTION CHECKBOX */}
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={isSelected}
                    onChange={() =>
                      onFieldChange(
                        field.name,
                        isSelected
                          ? selectedValues.filter((v) => v !== option.value)
                          : [...selectedValues, option.value],
                      )
                    }
                    size="small"
                    sx={{
                      color: "#D1D5DB",
                      "&.Mui-checked": {
                        color: "#000000",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: { xs: 20, md: 22, lg: 24 },
                      },
                      padding: "4px",
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (isSearchable) {
    return (
      <div className="max-w-[448px] mx-auto bg-white border-2 border-[#D4D4D4] rounded-2xl p-3">
        {/* SELECTED TAGS */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 px-1">
            <div className="flex items-center gap-2 text-[#737373] font-manrope text-[14px] font-semibold">
              {/* Optional header */}
            </div>
            {selectedValues.map((val) => {
              const opt = options.find((o: any) => o.value === val);
              return (
                <div
                  key={val}
                  className="px-3 py-1 bg-white border border-gray-800 rounded-lg text-sm font-medium flex items-center gap-2 font-manrope text-[14px]"
                >
                  {opt?.label}
                  <button
                    onClick={() =>
                      onFieldChange(
                        field.name,
                        selectedValues.filter((v) => v !== val),
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

        {/* SEARCH INPUT */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchQueryChange(field.name, e.target.value)}
            placeholder={field.searchPlaceholder || "Search..."}
            className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-gray-400 outline-none font-manrope text-[14px]"
          />
        </div>

        {/* OPTIONS LIST */}
        <div className="space-y-0 max-h-[150px] overflow-y-auto">
          {filteredOptions.map((option: any) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() =>
                  onFieldChange(
                    field.name,
                    isSelected
                      ? selectedValues.filter((v) => v !== option.value)
                      : [...selectedValues, option.value],
                  )
                }
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg"
              >
                {/* CHECKBOX */}
                <div
                  className={`w-6 h-6 border-2 rounded-[4px] flex items-center justify-center ${
                    isSelected
                      ? "bg-black border-black"
                      : "border-gray-300 bg-white"
                  }`}
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

                {/* OPTION NAME */}
                <span className="text-gray-800 font-medium font-manrope text-[16px]">
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default MultiSelectField;
