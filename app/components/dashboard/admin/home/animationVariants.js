export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20, 
      duration: 0.5 
    }
  }
};

export const tabVariants = {
  inactive: { 
    opacity: 0.7,
    scale: 0.95,
    backgroundColor: "rgba(26, 31, 46, 0.5)"
  },
  active: { 
    opacity: 1,
    scale: 1,
    backgroundColor: "rgba(42, 47, 62, 0.8)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
  }
};

export const refreshIconVariants = {
  static: { rotate: 0 },
  rotating: { 
    rotate: 360, 
    transition: { 
      duration: 1,
      ease: "linear",
      repeat: Infinity 
    } 
  }
}; 