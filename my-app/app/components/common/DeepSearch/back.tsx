interface BackButtonProps {
  label?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function BackButton({
  label = "Back",
  className = "",
  disabled = false,
  onClick,
}: BackButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        fontSize: "16px",
      }}
      className={`
        bg-transparent
        border-none
        outline-none
        p-0
        m-0
        
        flex
        items-center
        gap-2
        
        text-gray-700
        font-medium

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
        ${className}
      `}
    >
      <img src="/arrow-left.svg" alt="Back arrow" className="w-5 h-5" />
      {label}
    </button>
  );
}
