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
      className={`
        rounded-[8px]
        border
        border-[#E5E5E5]
        bg-[#F5F5F5]
        flex
        p-[8px_16px]
        justify-center
        items-center
        gap-[6px]
        font-manrope
        text-[14px]
        font-semibold
        leading-[150%]
        text-[#262626]
        cursor-pointer
        transition-all
        duration-150
        ease-out
        
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
      <img src="/x.svg" alt="Close icon" className="w-[16px] h-[16px]" />

      <span>Close</span>
    </button>
  );
}
