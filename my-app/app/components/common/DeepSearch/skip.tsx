interface SkipButtonProps {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SkipButton({
  className = "",
  disabled = false,
  onClick,
}: SkipButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        /* Mobile styles - filled button */
        flex
        justify-center
        items-center
        gap-2
        px-4
        py-3
        rounded-lg
        border
        border-[#E5E5E5]
        bg-[#F5F5F5]
        text-[#262626]
        text-[14px]
        font-medium
        
        /* Desktop styles - text button */
        sm:bg-transparent
        sm:border-none
        sm:p-0
        sm:text-gray-700
        sm:text-[15px]
        md:text-[16px]
        sm:underline
        sm:underline-offset-2
        
        transition-all
        duration-150
        ease-out
        
        /* Mobile hover */
        hover:bg-[#E5E5E5]
        
        /* Desktop hover */
        sm:hover:bg-transparent
        sm:hover:-translate-y-[1px]
        sm:hover:text-gray-900
        
        /* Active state */
        active:scale-95
        sm:active:translate-y-[1px]
        sm:active:scale-100
        
        cursor-pointer
        select-none
        
        /* Disabled state */
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-[#F5F5F5]
        disabled:hover:scale-100
        sm:disabled:hover:translate-y-0
        sm:disabled:hover:text-gray-700
        sm:disabled:hover:bg-transparent
        
        ${className}
      `}
    >
      Skip
    </button>
  );
}
