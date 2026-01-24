"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "map";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "lg",
  className = "",
}: ModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw] h-[90vh]",
    // Desktop: fixed size, Mobile/Tablet: fullscreen
    map: "lg:w-[1236px] lg:h-[576px] w-full h-full lg:max-w-[1236px] lg:max-h-[576px]",
  };

  const isMapSize = size === "map";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-0 lg:p-4 ${className}`}
      aria-modal="true"
      role="dialog"
    >
      {/* BACKGROUND OVERLAY */}
      <div
        className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div
        className={`relative z-10 ${sizeClasses[size]} transition-all ${
          isMapSize
            ? "lg:border-[0px] lg:border-[#FFFFFF] lg:rounded-[24px] rounded-none bg-[#FFFFFF] lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] shadow-none"
            : ""
        }`}
      >
        <div
          className={`bg-white h-full w-full overflow-hidden ${
            !isMapSize
              ? "rounded-2xl shadow-2xl"
              : "lg:rounded-[8px] rounded-none"
          }`}
        >
          {/* Header - Only for standard modals, skipped for Map size */}
          {title && !isMapSize && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}

          {/* Body - Map fits perfectly here */}
          <div className={`${isMapSize ? "h-full w-full" : "p-6"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
