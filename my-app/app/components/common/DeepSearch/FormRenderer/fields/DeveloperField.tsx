import React from "react";
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

  return (
    <div className="max-w-[448px] mx-auto bg-white border-2 border-[#D4D4D4] rounded-2xl p-3">
      {/* SELECTED DEVELOPERS TAGS */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 px-1">
          <div className="flex items-center gap-2 text-[#737373] font-manrope text-[14px] font-semibold">
            {/* <img src="/home.svg" alt="Developers" className="w-5 h-5" /> */}
            {/* <span>Developers</span> */}
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

      {/* DEVELOPER SEARCH INPUT */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchQueryChange(field.name, e.target.value)}
          placeholder={field.searchPlaceholder || "Search..."}
          className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-gray-400 outline-none font-manrope text-[14px]"
        />
      </div>

      {/* DEVELOPER OPTIONS LIST */}
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
              {/* CHECKBOX FOR DEVELOPER SELECTION */}
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

              {/* DEVELOPER NAME */}
              <span className="text-gray-800 font-medium font-manrope text-[16px]">
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeveloperField;
