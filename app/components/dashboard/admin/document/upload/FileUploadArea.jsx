import React from 'react';
import { motion } from 'framer-motion';
import { IoCloudUpload } from 'react-icons/io5';

const FileUploadArea = ({ 
  isDragging, 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  handleUploadClick, 
  fileInputRef, 
  handleFileUpload,
  isUploading
}) => {
  return (
    <div 
      className={`mt-8 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-[#2a2f3e] bg-[#1a1f2e]/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".xlsx,.xls"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
          <IoCloudUpload className="text-4xl text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          {isDragging ? "Drop file here" : "Upload Excel File"}
        </h3>
        <p className="text-[var(--foreground-secondary)] mb-4 max-w-md">
          Drag and drop your Excel file here, or click to select a file.
          Make sure it contains student data with proper formatting.
        </p>
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className={`px-5 py-2 rounded-lg flex items-center gap-2 ${
            isUploading
              ? "bg-blue-800/50 text-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <IoCloudUpload /> 
          {isUploading ? "Uploading..." : "Select File"}
        </button>
        <p className="text-xs text-[var(--foreground-secondary)] mt-4">
          Supported formats: .xlsx, .xls
        </p>
      </motion.div>
    </div>
  );
};

export default FileUploadArea; 