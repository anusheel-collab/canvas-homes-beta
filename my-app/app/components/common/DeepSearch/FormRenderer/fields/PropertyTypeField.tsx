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
      <div className="flex flex-wrap justify-center gap-[24px] max-w-[calc(3*168px+2*24px)] mx-auto">
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
              className={`relative text-center transition-all bg-[#FAFAFA] py-[12px_20px] px-[16px] rounded-[16px] ${
                isSelected
                  ? "border-2 border-black"
                  : "border-2 border-[#A3A3A3]"
              }`}
              style={{
                width: "168px",
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
                <div className="font-manrope text-[18px] font-semibold text-gray-800 w-[168px] h-[36px]">
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
