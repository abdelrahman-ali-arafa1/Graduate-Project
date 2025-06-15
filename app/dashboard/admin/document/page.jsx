"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { FaFileUpload, FaUserEdit } from 'react-icons/fa';

// Import components
import PageHeader from '@/app/components/dashboard/admin/document/PageHeader';
import DocumentCard from '@/app/components/dashboard/admin/document/DocumentCard';

const Document = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className="p-3 sm:p-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <PageHeader 
        title="Document Management" 
        subtitle="Upload, edit, and manage student documents and excel sheets" 
      />

      {/* Main Content Area */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <DocumentCard 
          icon={FaFileUpload}
          title="Upload Excel Sheet"
          description="Upload student data via Excel spreadsheets for batch processing"
          actionText="Upload Now"
          path="/dashboard/admin/document/upload"
          bgColorClass="bg-blue-600/20 text-blue-400"
        />

        <DocumentCard 
          icon={FaUserEdit}
          title="Edit Students"
          description="View and edit student information by level and department"
          actionText="Manage Students"
          path="/dashboard/admin/document/studentsEdit"
          bgColorClass="bg-purple-600/20 text-purple-400"
        />
      </motion.div>
    </motion.div>
  );
};

export default Document; 