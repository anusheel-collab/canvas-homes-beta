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
  border-none
  outline-none
  transition-all
  duration-200
  ease-out
  cursor-pointer
  select-none
  whitespace-nowrap
  
  ${disabled ? "bg-[#E5E5E5] text-[#737373]" : "bg-[#6B21A8] text-[#FFFFFF]"}
  
  hover:-translate-y-[1px]
  hover:shadow-md
  active:translate-y-[1px]
  active:shadow-sm

  disabled:cursor-not-allowed
  disabled:hover:translate-y-0
  disabled:hover:shadow-none
  
  p-[12px_62px]
  rounded-[8px]
  font-manrope
  text-[16px]
  font-semibold
  leading-[150%]
`}
    >
      {label}
    </button>
  );
}
