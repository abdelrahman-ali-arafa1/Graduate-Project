import React from "react";
import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <div className="min-h-[400px] flex justify-center items-center">
      <div className="relative w-20 h-20">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 border-t-[#7950f2] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.2, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">
          Loading
        </div>
      </div>
    </div>
  );
};

export default LoadingState; 