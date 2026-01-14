"use client";

interface PerfectButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export default function PerfectButton({
  onClick,
  disabled = false,
  label = "Yes. It is perfect",
}: PerfectButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        items-center
        justify-center
        gap-2
        rounded-lg
        border-none
        outline-none
        transition-all
        duration-200
        ease-out
        cursor-pointer
        select-none
        whitespace-nowrap
        
        ${disabled ? "bg-[#E5E5E5]" : "bg-[#6B21A8]"}
        
        hover:-translate-y-[1px]
        hover:shadow-md
        active:translate-y-[1px]
        active:shadow-sm

        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
        disabled:hover:shadow-none
      `}
      style={{
        padding: "12px 62px",
        borderRadius: "8px",
        fontFamily: "Manrope, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "150%",
        color: disabled ? "#737373" : "#FFFFFF",
      }}
    >
      {label}
    </button>
  );
}
