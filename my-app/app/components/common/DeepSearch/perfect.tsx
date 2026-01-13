"use client";

import { useState } from "react";

export default function PerfectButton() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      onClick={() => setIsClicked(!isClicked)}
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
        
        ${isClicked ? "bg-[#6B21A8]" : "bg-[#E5E5E5]"}
        
        hover:-translate-y-[1px]
        hover:shadow-md
        active:translate-y-[1px]
        active:shadow-sm
      `}
      style={{
        padding: "12px 62px",
        borderRadius: "8px",
        fontFamily: "Manrope, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "150%",
        color: isClicked ? "#FFFFFF" : "#737373", // Use style prop for color
      }}
    >
      Yes. It is perfect
    </button>
  );
}
