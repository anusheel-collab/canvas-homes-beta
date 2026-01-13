"use client";

interface LoaderProps {
  percentage: number;
}

export default function Loader({ percentage }: LoaderProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full px-6">
      <div className="relative w-full" style={{ height: "32px" }}>
        {/* Background: Unfilled progress - color #D4D4D4 - FULL WIDTH */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            height: "4px",
            backgroundColor: "#D4D4D4",
            borderRadius: "8px",
          }}
        />

        {/* Foreground: Filled progress - color #404040 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: `${safePercentage}%`,
            height: "4px",
            backgroundColor: "#404040",
            borderRadius: safePercentage === 100 ? "8px" : "0 8px 8px 0",
          }}
        />

        {/* Circular head at the end of progress */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${safePercentage}%`,
            // Shift head 4px to the left at 0%, otherwise center it
            transform:
              safePercentage === 0
                ? "translate(0px, -50%)" // 4px to the right at 0%
                : "translate(-50%, -50%)", // Centered for all other positions
            borderRadius: "400px",
            backgroundColor: "#404040",
            display: "inline-flex",
            height: "32px",
            minWidth: "32px",
            padding: "0 4px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* Percentage inside circular head */}
          <span
            style={{
              color: "#FAFAFA",
              textAlign: "center",
              fontFamily: "Manrope, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "150%",
              whiteSpace: "nowrap",
            }}
          >
            {safePercentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
