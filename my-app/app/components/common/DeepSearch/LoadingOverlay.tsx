// components/LoadingOverlay.tsx
export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading Map...</p>
      </div>
    </div>
  );
}
