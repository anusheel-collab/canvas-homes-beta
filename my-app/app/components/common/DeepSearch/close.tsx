interface CloseButtonProps {
  className?: string;
  disabled?: boolean;
}

export default function CloseButton({
  className = "",
  disabled = false,
}: CloseButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        borderRadius: "8px",
        border: "1px solid #E5E5E5",
        background: "#F5F5F5",
        display: "flex",
        padding: "8px 16px",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        fontFamily: "Manrope, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: "150%",
        color: "#262626",
        cursor: "pointer",
        transition: "all 0.15s ease-out",
      }}
      className={`
        hover:-translate-y-[1px]
        hover:shadow-[0_4px_8px_rgba(0,0,0,0.12)]
        active:translate-y-[1px]
        active:shadow-[0_1px_2px_rgba(0,0,0,0.12)]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      aria-label="Close"
    >
      {/* x.svg icon on the left */}
      <img
        src="/x.svg"
        alt="Close icon"
        style={{ width: "16px", height: "16px" }}
      />

      <span>Close</span>
    </button>
  );
}
