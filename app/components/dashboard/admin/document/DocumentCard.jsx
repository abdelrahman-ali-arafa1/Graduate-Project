import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const DocumentCard = ({ icon: Icon, title, description, actionText, path, bgColorClass }) => {
  const router = useRouter();
  
  // Animation variants
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  return (
    <motion.div
      className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl border border-[#2a2f3e] hover:border-blue-500/30 transition-colors"
      variants={cardVariants}
      whileHover="hover"
      onClick={() => router.push(path)}
    >
      <div className="flex items-center mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColorClass} rounded-full flex items-center justify-center text-lg sm:text-xl`}>
          <Icon />
        </div>
      </div>
      <h3 className="text-base sm:text-xl font-semibold text-[var(--foreground)] mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] mb-3">
        {description}
      </p>
      <div className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm">
        {actionText} <span className="ml-2">&rarr;</span>
      </div>
    </motion.div>
  );
};

export default DocumentCard; 