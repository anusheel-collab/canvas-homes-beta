import React from "react";
import Checkbox from "@mui/material/Checkbox";

interface PropertyTypeFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
}

const PropertyTypeField: React.FC<PropertyTypeFieldProps> = ({
  field,
  formData,
  onFieldChange,
}) => {
  const options = field.filterOptions
    ? field.filterOptions(field.options || [], formData)
    : field.options || [];

  const selectedValues: string[] = formData[field.name] || [];

  return (
    <div className="w-full space-y-6 max-w-4xl mx-auto">
      {/* PROPERTY TYPE SELECTION (VISUAL) */}
      <div
        className={`flex flex-wrap justify-center gap-[24px] mx-auto ${
          field.name === "configuration"
            ? "max-w-[calc(3*189px+2*24px)]"
            : "max-w-[calc(3*200px+2*24px)]"
        }`}
      >
        {options.map((option: any) => {
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
              className={`relative transition-all ${
                field.name === "configuration" // When in configuration step
                  ? // CONFIGURATION STYLE (apartment-style banners)
                    `flex px-[16px] py-[12px] justify-center items-center rounded-[8px] border-[1.5px] ${
                      isSelected
                        ? "border-[#D4D4D4] bg-[#FAFAFA] text-[#262626]"
                        : "border-[#D4D4D4] bg-[#FAFAFA] text-[#262626] hover:bg-[#F5F5F5]"
                    }`
                  : // DEFAULT PROPERTY TYPE STYLE
                    `text-center bg-[#FAFAFA] py-[12px_20px] px-[16px] rounded-[16px] ${
                      isSelected
                        ? "border-2 border-black"
                        : "border-2 border-[#E5E5E5]"
                    }`
              }`}
              style={{
                width: field.name === "configuration" ? "189px" : "200px",
                height: field.name === "configuration" ? "44px" : undefined,
              }}
            >
              {field.name === "configuration" ? (
                // CONFIGURATION LAYOUT (Simple horizontal layout)
                <div className="flex items-center w-full gap-[16px]">
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
                        fontSize: 29,
                      },
                    }}
                  />
                  <span className="font-manrope text-[18px] font-semibold text-gray-800">
                    {option.label}
                  </span>
                </div>
              ) : (
                // PROPERTY TYPE LAYOUT (with icons)
                <div className="flex flex-col items-center gap-3">
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
                  <div className="font-manrope text-[18px] font-semibold text-gray-800 w-[168px] h-[36px]">
                    {option.label}
                  </div>
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
                        fontSize: 29,
                      },
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyTypeField;
