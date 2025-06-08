import React from "react";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 border-t-[var(--primary)] rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingState; 