import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTable, FaCheck, FaSave, FaExclamationTriangle } from 'react-icons/fa';

const FilePreview = ({ 
  hasData, 
  fileName, 
  fileSize, 
  uploadedData, 
  validationErrors, 
  handleFileSave, 
  isUploading 
}) => {
  if (!hasData) return null;
  
  return (
    <motion.div
      className="mt-8 bg-[#1a1f2e] rounded-xl border border-[#2a2f3e] overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-[#232738] p-4 border-b border-[#2a2f3e] flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
            <FaTable className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">{fileName}</h3>
            <p className="text-xs text-[var(--foreground-secondary)]">
              {fileSize} • {uploadedData.length} rows
            </p>
          </div>
        </div>
        <button
          onClick={handleFileSave}
          disabled={isUploading || validationErrors.length > 0}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            isUploading || validationErrors.length > 0
              ? "bg-green-800/30 text-green-400/50 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <FaSave /> Save Data
            </>
          )}
        </button>
      </div>
      
      {/* Validation Errors */}
      <AnimatePresence>
        {validationErrors.length > 0 && (
          <motion.div
            className="border-b border-[#2a2f3e] bg-red-900/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="p-4">
              <div className="flex items-center mb-2">
                <FaExclamationTriangle className="text-red-400 mr-2" />
                <h4 className="text-red-400 font-semibold">Validation Errors</h4>
              </div>
              <ul className="text-red-300 text-sm space-y-1 pl-6 list-disc">
                {validationErrors.map((error, index) => (
                  <li key={`error-${error}-${index}`}>{error}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Data Preview */}
      <div className="p-4 max-h-[400px] overflow-auto">
        {validationErrors.length === 0 && (
          <div className="flex items-center mb-3 text-green-400 text-sm">
            <FaCheck className="mr-2" /> Data validated successfully
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2a2f3e]">
            <thead>
              <tr>
                {uploadedData.length > 0 && 
                  Object.keys(uploadedData[0]).map((header, index) => (
                    <th 
                      key={`header-${index}`}
                      className="px-4 py-3 bg-[#232738] text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3e]">
              {uploadedData.slice(0, 5).map((row, rowIndex) => (
                <tr key={`${row.name || ''}-${row.email || ''}-${rowIndex}`}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td 
                      key={`${row.name || ''}-${row.email || ''}-${rowIndex}-${cellIndex}`}
                      className="px-4 py-2 text-sm text-[var(--foreground)]"
                    >
                      {cell?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
              {uploadedData.length > 5 && (
                <tr>
                  <td 
                    colSpan={Object.keys(uploadedData[0]).length}
                    className="px-4 py-2 text-center text-sm text-[var(--foreground-secondary)]"
                  >
                    ...and {uploadedData.length - 5} more rows
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FilePreview; 