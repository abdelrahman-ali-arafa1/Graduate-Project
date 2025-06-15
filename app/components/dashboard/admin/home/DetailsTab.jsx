"use client";

import React from "react";
import { motion } from "framer-motion";
import AdminWeeklySummary from "@/app/components/dashboard/admin/AdminWeeklySummary";
import AdminDailyAttendance from "@/app/components/dashboard/admin/AdminDailyAttendance";

const DetailsTab = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div 
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AdminWeeklySummary data={data} />
        </motion.div>
        
        <motion.div 
          className="lg:col-span-2" 
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AdminDailyAttendance data={data} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DetailsTab; 