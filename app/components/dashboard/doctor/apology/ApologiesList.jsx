import React from "react";
import { motion } from "framer-motion";
import ApologyCard from "./ApologyCard";
import EmptyState from "./EmptyState";

const ApologiesList = ({
  filteredApologies,
  statusFilter,
  getStatusColor,
  getStatusIcon,
  formatDate,
  handleViewDetails,
  setCourseFilter,
  setStatusFilter
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredApologies.length > 0 ? (
        filteredApologies.map((apology) => (
          <ApologyCard
            key={apology._id}
            apology={apology}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            formatDate={formatDate}
            handleViewDetails={handleViewDetails}
          />
        ))
      ) : (
        <EmptyState 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter}
          setCourseFilter={setCourseFilter}
        />
      )}
    </motion.div>
  );
};

export default ApologiesList; 