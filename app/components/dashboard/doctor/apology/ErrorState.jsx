import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const ErrorState = ({ error }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[500px] text-red-500">
      <FaTimesCircle className="text-5xl mb-4" />
      <p className="text-lg">Error: {error.message || "Failed to fetch apologies"}</p>
    </div>
  );
};

export default ErrorState; 