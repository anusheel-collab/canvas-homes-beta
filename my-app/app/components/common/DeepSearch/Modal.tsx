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
    map: "w-[1236px] h-[576px]",
  };

  const isMapSize = size === "map";

  return (
    <div
      className={`fixed top-1/2 left-3/7 transform -translate-y-1/2 -translate-x-1/2 inset-0 z-[9999] p-4 ${className}`}
      aria-modal="true"
      role="dialog"
    >
      {/* BACKGROUND OVERLAY - Fixed to viewport */}
      {/* <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-800/50 backdrop-blur-sm overflow-y-auto py-8"
        onClick={onClose}
      /> */}

      {/* MODAL CONTAINER - Centered via Flexbox */}
      <div
        className={`relative z-10 ${sizeClasses[size]} transition-all my-auto ${
          isMapSize
            ? "w-[1236px] h-[576px] border-[0px] border-[#FFFFFF] rounded-[24px] bg-[#FFFFFF] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
            : ""
        }`}
      >
        <div
          className={`bg-white h-full w-full overflow-hidden ${
            !isMapSize ? "rounded-2xl shadow-2xl" : "rounded-[8px]"
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
