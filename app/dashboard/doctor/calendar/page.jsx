"use client";

import React from "react";
import { motion } from "framer-motion";

const CalendarPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[50vh] flex items-center justify-center p-4 sm:p-6"
    >
      <h1 className="text-lg sm:text-2xl font-bold text-gray-400 text-center">Calendar Page</h1>
    </motion.div>
  );
};

export default CalendarPage; 