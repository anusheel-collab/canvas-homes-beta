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
        bg-transparent
        border-none
        outline-none
        p-0
        m-0
        
        text-gray-700
        text-[16px]
        font-medium
        underline
        underline-offset-2
        
        transition-all
        duration-150
        ease-out
        
        hover:-translate-y-[1px]
        hover:text-gray-900
        
        active:translate-y-[1px]
        
        cursor-pointer
        select-none
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
        disabled:hover:text-gray-700
        ${className}
      `}
    >
      Skip
    </button>
  );
}
