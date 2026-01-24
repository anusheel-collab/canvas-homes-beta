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
        className={`flex flex-wrap justify-center gap-[16px] md:gap-[20px] lg:gap-[24px] mx-auto ${
          field.name === "configuration"
            ? "max-w-[calc(2*137px+1*16px)] md:max-w-[calc(3*168px+2*20px)] lg:max-w-[calc(3*189px+2*24px)]"
            : "max-w-[calc(2*137px+1*16px)] md:max-w-[calc(3*168px+2*20px)] lg:max-w-[calc(3*168px+2*24px)]"
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
                field.name === "configuration"
                  ? `flex px-[12px] md:px-[14px] lg:px-[16px] py-[10px] md:py-[11px] lg:py-[12px] justify-center items-center rounded-[8px] border-[1.5px] w-[137px] md:w-[168px] lg:w-[189px] h-[38px] md:h-[42px] lg:h-[44px] ${
                      isSelected
                        ? "border-[#D4D4D4] bg-[#FAFAFA] text-[#262626]"
                        : "border-[#D4D4D4] bg-[#FAFAFA] text-[#262626] hover:bg-[#F5F5F5]"
                    }`
                  : `text-center bg-[#FAFAFA] px-[12px] md:px-[14px] lg:px-[16px] rounded-[12px] md:rounded-[14px] lg:rounded-[16px] w-[137px] md:w-[168px] lg:w-[168px] h-[138px] md:h-[155px] lg:h-[197px] ${
                      isSelected
                        ? "border-2 border-black"
                        : "border-2 border-[#E5E5E5]"
                    }`
              }`}
            >
              {field.name === "configuration" ? (
                <div className="flex items-center w-full gap-[12px] md:gap-[14px] lg:gap-[16px]">
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
                        fontSize: { xs: 24, md: 26, lg: 29 },
                      },
                    }}
                  />
                  <span className="font-manrope text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-gray-800">
                    {option.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-0 h-full justify-between py-[6px] md:py-[8px] lg:py-[10px]">
                  {option.icon && (
                    <div className="w-[113px] h-[80px] md:w-[140px] md:h-[100px] lg:w-[140px] lg:h-[100px] flex items-center justify-center">
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
                  <div className="font-manrope text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-gray-800 flex items-center justify-center px-1">
                    {option.label}
                  </div>
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
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyTypeField;
