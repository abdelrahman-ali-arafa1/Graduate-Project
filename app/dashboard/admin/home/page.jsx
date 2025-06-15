"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUsers, FaUserCheck, FaUserTimes, FaCalendarAlt } from "react-icons/fa";
import AdminDashCard from "@/app/components/dashboard/admin/AdminDashCard";
import { useLanguage } from "@/app/components/providers/LanguageProvider";
import { useDashboardAdmin } from "@/app/hooks/useDashboardAdmin";
import DashboardHeader from "@/app/components/dashboard/admin/home/DashboardHeader";
import TabNavigation from "@/app/components/dashboard/admin/home/TabNavigation";
import LoadingState from "@/app/components/dashboard/admin/home/LoadingState";
import ErrorState from "@/app/components/dashboard/admin/home/ErrorState";
import NoDataState from "@/app/components/dashboard/admin/home/NoDataState";
import OverviewTab from "@/app/components/dashboard/admin/home/OverviewTab";
import DetailsTab from "@/app/components/dashboard/admin/home/DetailsTab";
import PerformanceSummary from "@/app/components/dashboard/admin/home/PerformanceSummary";
import { containerVariants, itemVariants } from "@/app/components/dashboard/admin/home/animationVariants";

const DashHome = () => {
  const { t } = useLanguage();
  const {
    attendanceData,
    loading,
    error,
    activeTab,
    showRefreshAnimation,
    setActiveTab,
    handleRefresh,
    calculateSummaryData,
    preparePieChartData,
  } = useDashboardAdmin();

  // Safe value handler to prevent NaN
  const safeValue = (value) => isNaN(value) ? 0 : value;

  if (loading) {
    return <LoadingState />;
  }

  if (error && !attendanceData) {
    return <ErrorState error={error} handleRefresh={handleRefresh} />;
  }

  if (!attendanceData || !attendanceData.days) {
    return <NoDataState handleRefresh={handleRefresh} />;
  }

  const summary = calculateSummaryData();
  const pieChartData = preparePieChartData();
  
  // Ensure summary values are valid numbers
  const safeSummary = {
    ...summary,
    overallAttendanceRate: safeValue(summary.overallAttendanceRate),
    totalAttendanceRate: safeValue(summary.totalAttendanceRate),
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <DashboardHeader 
        startDate={attendanceData.startDate}
        endDate={attendanceData.endDate}
        handleRefresh={handleRefresh}
        showRefreshAnimation={showRefreshAnimation}
      />
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        variants={itemVariants}
      >
        <AdminDashCard 
          title={t('attendanceRate') || 'Attendance Rate'}
          value={`${safeSummary.overallAttendanceRate}%`}
          icon={<FaUsers className="text-blue-400" size={20} />}
          color="bg-blue-900"
          subtitle={t('forThePeriod') || 'For the period'} 
          animate={true}
          isIncrease={safeSummary.overallAttendanceRate >= 70}
          percentage={safeSummary.overallAttendanceRate >= 70 ? (t('good') || 'Good') : safeSummary.overallAttendanceRate >= 50 ? (t('average') || 'Average') : (t('poor') || 'Poor')}
        />
        <AdminDashCard 
          title={t('present') || 'Present'}
          value={summary.totalPresent}
          percentage={`${safeSummary.totalAttendanceRate}%`}
          isIncrease={safeSummary.totalAttendanceRate >= 50}
          icon={<FaUserCheck className="text-green-400" size={20} />}
          color="bg-green-900"
          animate={true}
        />
        <AdminDashCard 
          title={t('absent') || 'Absent'}
          value={summary.totalAbsent}
          percentage={`${safeValue(100 - safeSummary.totalAttendanceRate)}%`}
          isIncrease={false}
          icon={<FaUserTimes className="text-red-400" size={20} />}
          color="bg-red-900"
          animate={true}
        />
        <AdminDashCard 
          title={t('reportingPeriod') || 'Reporting Period'}
          value={t('last7Days') || 'Last 7 Days'}
          icon={<FaCalendarAlt className="text-purple-400" size={20} />}
          color="bg-purple-900"
          subtitle={`${attendanceData.startDate} - ${attendanceData.endDate}`}
          animate={true}
        />
      </motion.div>
      
      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <OverviewTab key="overview" data={attendanceData.days} pieChartData={pieChartData} />
        ) : (
          <DetailsTab key="details" data={attendanceData.days} />
        )}
      </AnimatePresence>
      
      <PerformanceSummary summary={safeSummary} attendanceData={attendanceData.days} />
    </motion.div>
  );
};

export default DashHome; 