import React from "react";
import { motion } from "framer-motion";

// This component is no longer used and has been replaced with specialized versions
const DashCard = ({ title, value }) => {
  console.warn("DashCard is deprecated and should not be used");
  return (
    <motion.div 
      className="p-5 bg-[#232738] rounded-xl shadow-md h-full border border-[#2a2f3e]"
    >
      <h3 className="text-gray-400 text-xs uppercase tracking-wider font-medium">{title}</h3>
      <p className="text-xl font-bold text-white mt-2">{value || "N/A"}</p>
      <p className="text-gray-400 text-sm mt-3">Component is no longer available</p>
    </motion.div>
  );
};

export default DashCard;
