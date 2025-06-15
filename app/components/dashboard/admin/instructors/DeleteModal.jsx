"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useLanguage } from "@/app/components/providers/LanguageProvider";
import { modalVariants, overlayVariants } from "./constants/animationVariants";

const DeleteModal = ({ 
  isOpen, 
  instructor, 
  isDeleting, 
  deleteError, 
  onClose, 
  onConfirm 
}) => {
  const { t } = useLanguage();

  if (!isOpen || !instructor) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="bg-[#1a1f2e] p-6 rounded-xl max-w-md w-full mx-4 border border-red-500/30 shadow-lg shadow-red-500/10"
        variants={modalVariants}
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
            <FaTrash className="text-red-500 text-xl" />
          </div>
          <h3 className="text-xl font-bold text-white">{t('confirmDeletion') || 'Confirm Deletion'}</h3>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-gray-300">
            {t('deleteConfirmationMessage') || 'Are you sure you want to delete instructor'} <span className="text-white font-semibold">{instructor.name}</span>? {t('actionCannotBeUndone') || 'This action cannot be undone.'}
          </p>
        </div>
        
        {deleteError && (
          <motion.div 
            className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mb-6 text-red-300 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {deleteError}
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-end gap-4">
          <motion.button 
            className="px-4 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
          >
            {t('cancel') || 'Cancel'}
          </motion.button>
          <motion.button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(239, 68, 68, 0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {t('deleting') || 'Deleting...'}
              </>
            ) : (
              <>
                <FaTrash className="mr-2" /> {t('delete') || 'Delete'}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteModal; 