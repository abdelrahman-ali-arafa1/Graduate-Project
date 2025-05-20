'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

/**
 * مكون لعرض إشعارات الخطأ
 * يمكن استخدامه في أي مكان في التطبيق
 */
const ErrorNotification = ({ 
  message, 
  visible = false, 
  onClose, 
  autoClose = true,
  duration = 5000 // مدة ظهور الإشعار بالمللي ثانية
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    setIsVisible(visible);
    
    // إغلاق تلقائي بعد المدة المحددة
    let timer;
    if (visible && autoClose) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, autoClose, duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          <span className="text-sm">{message || 'حدث خطأ ما'}</span>
          <button 
            onClick={handleClose}
            className="ml-2 p-1 hover:bg-red-700 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <FaTimes size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorNotification; 