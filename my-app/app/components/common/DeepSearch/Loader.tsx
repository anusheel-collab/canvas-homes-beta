export default function Loader() {
  const currentStep = 3;
  const totalSteps = 10;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full px-6">
      {" "}
      {/* Full width with same padding as header */}
      <div className="relative w-full" style={{ height: "32px" }}>
        {/* Background: Unfilled progress - color #D4D4D4 - FULL WIDTH */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%", // Full width of container
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
            width: `${progressPercentage}%`, // Percentage of full width
            height: "4px",
            backgroundColor: "#404040",
            borderRadius: progressPercentage === 100 ? "8px" : "0 8px 8px 0",
          }}
        />

        {/* Circular head at the end of progress */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${progressPercentage}%`, // Position based on percentage of full width
            transform: "translate(-50%, -50%)",
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
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
