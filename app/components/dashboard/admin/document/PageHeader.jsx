import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      className="mb-4 sm:mb-8"
      variants={itemVariants}
    >
      <h1 className="text-xl sm:text-3xl font-bold text-[var(--foreground)] mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-[var(--foreground-secondary)]">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default PageHeader; 