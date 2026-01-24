"use client";

interface LoaderProps {
  percentage: number;
}

export default function Loader({ percentage }: LoaderProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full ">
      <div className="relative w-full h-[32px]">
        {/* Background: Unfilled progress - color #D4D4D4 - FULL WIDTH */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-[4px] bg-[#D4D4D4] rounded-[8px]" />

        {/* Foreground: Filled progress - color #404040 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[4px] bg-[#404040]"
          style={{
            width: `${safePercentage}%`,
            borderRadius: safePercentage === 100 ? "8px" : "0 8px 8px 0",
          }}
        />

        {/* Circular head at the end of progress */}
        <div
          className="absolute top-1/2 inline-flex h-[32px] min-w-[29px] px-[4px] justify-center items-center gap-[10px] bg-[#404040] rounded-[800px]"
          style={{
            left: `${safePercentage}%`,
            transform:
              safePercentage === 0
                ? "translate(0px, -50%)"
                : "translate(-50%, -50%)",
          }}
        >
          {/* Percentage inside circular head */}
          <span className="text-[#FAFAFA] text-center font-manrope text-[12px] font-semibold leading-[150%] whitespace-nowrap">
            {safePercentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
