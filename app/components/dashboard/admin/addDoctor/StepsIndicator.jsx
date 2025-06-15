"use client";

import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const StepsIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Professional" },
    { number: 3, label: "Courses" }
  ];
  
  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <div key={`step-${step.number}`} className="flex items-center">
          {/* Step indicator */}
          <div className="flex flex-col items-center">
            <motion.div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === step.number
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
                  : currentStep > step.number
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                    : 'bg-[#1a1f2e] text-gray-400'
              } border ${
                currentStep === step.number
                  ? 'border-blue-400/50 shadow-lg shadow-blue-500/30' 
                  : currentStep > step.number
                    ? 'border-green-400/50 shadow-md shadow-green-500/20' 
                    : 'border-gray-700'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: currentStep >= step.number ? "0 0 15px rgba(59, 130, 246, 0.4)" : "none"
              }}
            >
              {currentStep > step.number ? <FaCheck className="text-sm" /> : <span>{step.number}</span>}
            </motion.div>
            
            {/* Step label */}
            <motion.span 
              className={`mt-2 text-xs ${
                currentStep === step.number 
                  ? 'text-blue-300 font-medium' 
                  : currentStep > step.number 
                    ? 'text-green-300' 
                    : 'text-gray-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {step.label}
            </motion.span>
          </div>
          
          {/* Connector line between steps */}
          {index < steps.length - 1 && (
            <div className="mx-2 w-12 h-0.5 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gray-700"
                style={{ width: '100%' }}
              />
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500"
                initial={{ width: "0%" }}
                animate={{ 
                  width: currentStep > step.number + 1 
                    ? "100%" 
                    : currentStep > step.number 
                      ? "100%" 
                      : "0%" 
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          )}
        </div>
      ))}
      
      {/* Progress indicator at bottom */}
      <motion.div 
        className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"
        style={{ 
          width: `${((currentStep) / steps.length) * 100}%`,
          maxWidth: "100%"
        }}
        initial={{ width: "0%" }}
        animate={{ width: `${((currentStep) / steps.length) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};

export default StepsIndicator; 