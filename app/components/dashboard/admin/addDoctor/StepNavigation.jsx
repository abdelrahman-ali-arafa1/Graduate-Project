"use client";

import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

const StepNavigation = ({ 
  currentStep, 
  handlePrevStep, 
  handleNextStep, 
  handleAddUser, 
  isAdding 
}) => {
  return (
    <div className="flex justify-between mt-8">
      <motion.button
        onClick={handlePrevStep}
        className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
          currentStep === 1
            ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
            : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e] border border-[#2a2f3e] hover:border-blue-500/30'
        } transition-all`}
        whileHover={currentStep !== 1 ? { scale: 1.03, x: -3 } : {}}
        whileTap={currentStep !== 1 ? { scale: 0.97 } : {}}
        disabled={currentStep === 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>Previous</span>
      </motion.button>
      
      {currentStep < 3 ? (
        <motion.button
          onClick={handleNextStep}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md shadow-blue-500/20 border border-blue-500/50"
          whileHover={{ scale: 1.03, x: 3 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      ) : (
        <motion.button
          onClick={handleAddUser}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 shadow-md shadow-green-500/20 border border-green-500/50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <motion.div 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <FaUserPlus className="text-base" />
              <span>Add Instructor</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default StepNavigation; 