import React from "react";
import { FaClock } from "react-icons/fa";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center min-h-[500px]">
      <FaClock className="text-blue-400 text-5xl animate-spin" />
      <p className="ml-4 text-white text-lg">Loading apologies...</p>
    </div>
  );
};

export default LoadingState; 