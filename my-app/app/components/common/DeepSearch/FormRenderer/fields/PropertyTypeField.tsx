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
      <div className="flex flex-wrap justify-center gap-[24px] max-w-[calc(3*200px+2*24px)] mx-auto">
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
                    `flex px-[16px] py-[20px] justify-center items-center gap-[16px] flex-1 min-w-0 rounded-[8px] border-[1.5px] ${
                      isSelected
                        ? "border-[#D4D4D4] bg-[#FAFAFA] mt-[20px] text-[#262626]"
                        : "border-[#D4D4D4] bg-[#FAFAFA] text-[#262626] mt-[20px] hover:bg-[#F5F5F5]"
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
                height: field.name === "configuration" ? "24px" : undefined,
              }}
            >
              <div className="flex flex-col items-center gap-3">
                {/* PROPERTY TYPE ICON */}
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

                {/* PROPERTY TYPE LABEL */}
                <div
                  className={`${
                    field.name === "configuration"
                      ? "font-manrope text-[18px] mt-[60px] ml-[30px] font-semibold text-gray-800 w-[168px] h-[36px]"
                      : "font-manrope text-[18px] font-semibold text-gray-800 w-[168px] h-[36px]"
                  }`}
                >
                  {option.label}
                </div>

                {/* SELECTION CHECKBOX */}
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
                  className={`${
                    field.name === "configuration"
                      ? "translate-x-[-40px] translate-y-[-49px]"
                      : ""
                  }`}
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyTypeField;
