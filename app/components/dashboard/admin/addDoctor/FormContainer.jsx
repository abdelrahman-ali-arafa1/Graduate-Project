"use client";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

const FormContainer = ({ children }) => {
  return (
    <div className="bg-[#232738] rounded-xl p-6 shadow-lg border border-[#2a2f3e] overflow-hidden relative">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />

      <div className="relative">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormContainer; 