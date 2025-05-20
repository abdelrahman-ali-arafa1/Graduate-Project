"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaUserCheck, FaUserTimes, FaCalendarAlt, FaSync, FaArrowUp, FaChartLine, FaChartPie, FaChevronDown } from "react-icons/fa";
import AdminDashCard from "@/app/items/AdminDashCard";
import AdminLineChart from "@/app/items/AdminLineChart";
import AdminPieChart from "@/app/items/AdminPieChart";
import AdminWeeklySummary from "@/app/items/AdminWeeklySummary";
import AdminDailyAttendance from "@/app/items/AdminDailyAttendance";
import { useLanguage } from "@/app/components/LanguageProvider";

const DashHome = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRefreshAnimation, setShowRefreshAnimation] = useState(false);
  const { t, isRTL } = useLanguage();

  // Animation variants
  const containerVariants = {
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

  const itemVariants = {
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

  const tabVariants = {
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

  const refreshIconVariants = {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching attendance data...");
        
        const token = typeof window !== "undefined" ? localStorage.getItem("token")?.replace(/"/g, "") : null;
        
        let apiUrl = 'https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/dashboardAdmin';
        
        console.log("API URL:", apiUrl);
        console.log("Token available:", !!token);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          credentials: 'include',
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Data received:", data);
        
        if (!data || !data.days || !Array.isArray(data.days)) {
          throw new Error("Invalid data format received from API");
        }

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        
        const formatDate = (date) => {
          return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        };

        let processedDays = [...data.days].map(day => ({
          ...day,
          date: day.date,
          formattedDate: new Date(day.date).toLocaleDateString(),
          present: parseInt(day.present || 0),
          absent: parseInt(day.absent || 0),
          attendanceRate: Math.round(
            (parseInt(day.present || 0) / (parseInt(day.present || 0) + parseInt(day.absent || 0))) * 100
          ) || 0
        }));
        
        processedDays.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        
        if (processedDays.length > 7) {
          processedDays = processedDays.slice(-7);
        }
        
        const totalAttendanceRate = processedDays.reduce((sum, day) => sum + day.attendanceRate, 0);
        const averageAttendanceRate = Math.round(totalAttendanceRate / processedDays.length);
        
        const totalPresent = processedDays.reduce((sum, day) => sum + day.present, 0);
        const totalAbsent = processedDays.reduce((sum, day) => sum + day.absent, 0);
        const totalStudents = totalPresent + totalAbsent;
        
        const overallAttendanceRate = totalStudents > 0 
          ? Math.round((totalPresent / totalStudents) * 100) 
          : 0;
        
        console.log("Last 7 days data:", processedDays);
        console.log("Average attendance rate:", averageAttendanceRate);
        console.log("Overall attendance rate:", overallAttendanceRate);
        
        setAttendanceData({
          days: processedDays,
          startDate: formatDate(sevenDaysAgo),
          endDate: formatDate(today),
          averageAttendanceRate: averageAttendanceRate,
          overallAttendanceRate: overallAttendanceRate
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
        
        if (process.env.NODE_ENV === 'development') {
          console.log("Using sample data for development");
          
          const today = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 6);
          
          const formatDate = (date) => {
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          };
          
          const sampleDays = [];
          const tempDate = new Date(sevenDaysAgo);
          
          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(tempDate);
            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
            
            const present = Math.floor(Math.random() * 10) + 15;
            const absent = Math.floor(Math.random() * 5) + 2;
            const total = present + absent;
            const attendanceRate = Math.round((present / total) * 100);
            
            sampleDays.push({
              date: formatDate(currentDate),
              day: dayName,
              present: present,
              absent: absent,
              attendanceRate: attendanceRate,
              formattedDate: formatDate(currentDate)
            });
            
            tempDate.setDate(tempDate.getDate() + 1);
          }
          
          const totalAttendanceRate = sampleDays.reduce((sum, day) => sum + day.attendanceRate, 0);
          const averageAttendanceRate = Math.round(totalAttendanceRate / sampleDays.length);
          
          const totalPresent = sampleDays.reduce((sum, day) => sum + day.present, 0);
          const totalAbsent = sampleDays.reduce((sum, day) => sum + day.absent, 0);
          const totalStudents = totalPresent + totalAbsent;
          
          const overallAttendanceRate = totalStudents > 0 
            ? Math.round((totalPresent / totalStudents) * 100) 
            : 0;
          
          console.log("Sample days:", sampleDays);
          console.log("Average attendance rate:", averageAttendanceRate);
          console.log("Overall attendance rate:", overallAttendanceRate);
          
          setAttendanceData({
            days: sampleDays,
            startDate: formatDate(sevenDaysAgo),
            endDate: formatDate(today),
            averageAttendanceRate: averageAttendanceRate,
            overallAttendanceRate: overallAttendanceRate
          });
        }
      }
    };

    fetchData();
  }, [retryCount]);

  const calculateSummaryData = () => {
    if (!attendanceData || !attendanceData.days) return null;
    
    const days = attendanceData.days;
    
    const totalPresent = days.reduce((sum, day) => sum + day.present, 0);
    const totalAbsent = days.reduce((sum, day) => sum + day.absent, 0);
    const totalStudents = totalPresent + totalAbsent;
    
    const totalAttendanceRate = totalStudents > 0 
      ? Math.round((totalPresent / totalStudents) * 100) 
      : 0;
    
    const averageAttendanceRate = attendanceData.averageAttendanceRate || 0;
    
    const overallAttendanceRate = attendanceData.overallAttendanceRate || totalAttendanceRate;
    
    console.log("Total Present:", totalPresent);
    console.log("Total Absent:", totalAbsent);
    console.log("Total Attendance Rate:", totalAttendanceRate);
    console.log("Average Attendance Rate:", averageAttendanceRate);
    console.log("Overall Attendance Rate:", overallAttendanceRate);
    
    return {
      totalStudents,
      totalPresent,
      totalAbsent,
      totalAttendanceRate,
      averageAttendanceRate,
      overallAttendanceRate
    };
  };

  const preparePieChartData = () => {
    if (!attendanceData || !attendanceData.days) return [];
    
    const summary = calculateSummaryData();
    if (!summary) return [];
    
    return [
      {
        name: "Present",
        value: summary.totalPresent,
        color: "#4ade80"
      },
      {
        name: "Absent",
        value: summary.totalAbsent,
        color: "#f87171"
      }
    ];
  };

  const handleRetry = () => {
    setShowRefreshAnimation(true);
    setRetryCount(prev => prev + 1);
    
    setTimeout(() => {
      setShowRefreshAnimation(false);
    }, 2000);
  };

  if (loading) {
  return (
      <div className="flex flex-col items-center justify-center h-64">
          <motion.div
          className="rounded-full h-16 w-16 border-4 border-t-4 border-blue-500 mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="text-gray-300 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t('loadingData')}
        </motion.p>
      </div>
    );
  }

  if (error || !attendanceData) {
    return (
      <motion.div 
        className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-red-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-red-900/30 p-3 rounded-full mr-4">
            <FaTimesCircle className="text-red-500 text-xl" />
          </div>
          <h3 className="font-bold text-xl">{t('errorLoadingData')}</h3>
        </motion.div>
        
        <motion.p 
          className="mb-2 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {error || t('serverConnectionError')}
        </motion.p>
        
        <motion.p 
          className="mt-2 text-red-300/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {t('pleaseRefresh')}
        </motion.p>
        
        <motion.button 
          onClick={handleRetry}
          className="mt-6 bg-red-800/30 hover:bg-red-800/50 text-white py-3 px-6 rounded-lg transition-colors flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaSync className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('retry')}
        </motion.button>
      </motion.div>
    );
  }

  if (attendanceData && attendanceData.days) {
    const summary = calculateSummaryData();
    const pieChartData = preparePieChartData();
    
    return (
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-6 border border-blue-800/30"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {t('adminDashboard')}
              </motion.h1>
              <motion.p 
                className="text-blue-200/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
        >
                {t('last 7 Days')} • {attendanceData.startDate} - {attendanceData.endDate}
              </motion.p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-[#232738] text-white py-2 px-4 rounded-lg border border-[#2a2f3e] min-w-[160px] flex items-center justify-center">
                <span className="text-center">{t('All Courses')}</span>
              </div>
              
              <motion.button
                onClick={handleRetry}
                className="flex items-center bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  variants={refreshIconVariants}
                  animate={showRefreshAnimation ? "rotating" : "static"}
                >
                  <FaSync className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                </motion.div>
                {t('refresh')}
              </motion.button>
            </div>
          </div>
          
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-2"
          variants={itemVariants}
        >
          <motion.button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${activeTab === 'overview' ? 'bg-[#2a2f3e]/80 text-white' : 'bg-[#1a1f2e]/50 text-gray-400 hover:bg-[#1a1f2e]/80'}`}
            onClick={() => setActiveTab('overview')}
            variants={tabVariants}
            animate={activeTab === 'overview' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaChartLine className="text-blue-400" />
            {t('overview')}
          </motion.button>
          
            <motion.button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${activeTab === 'details' ? 'bg-[#2a2f3e]/80 text-white' : 'bg-[#1a1f2e]/50 text-gray-400 hover:bg-[#1a1f2e]/80'}`}
            onClick={() => setActiveTab('details')}
            variants={tabVariants}
            animate={activeTab === 'details' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaChartPie className="text-purple-400" />
            {t('details')}
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={itemVariants}
        >
          <AdminDashCard 
            title={t('attendanceRate')}
            value={`${summary.overallAttendanceRate}%`}
            icon={<FaChartLine className="text-blue-400" size={20} />}
            color="bg-blue-900"
            subtitle={t('forThePeriod') + " " + t('last7Days')}
            animate={true}
            isIncrease={summary.overallAttendanceRate >= 70}
            percentage={summary.overallAttendanceRate >= 70 ? t('good') : summary.overallAttendanceRate >= 50 ? t('average') : t('poor')}
          />
          <AdminDashCard 
            title={t('present')}
            value={summary.totalPresent}
            percentage={`${summary.totalAttendanceRate}%`}
            isIncrease={summary.totalAttendanceRate >= 50}
            icon={<FaUserCheck className="text-green-400" size={20} />}
            color="bg-green-900"
            animate={true}
          />
          <AdminDashCard 
            title={t('absent')}
            value={summary.totalAbsent}
            percentage={`${100 - summary.totalAttendanceRate}%`}
            isIncrease={false}
            icon={<FaUserTimes className="text-red-400" size={20} />}
            color="bg-red-900"
            animate={true}
          />
          <AdminDashCard 
            title={t('reportingPeriod')}
            value={t('last7Days')}
            icon={<FaCalendarAlt className="text-purple-400" size={20} />}
            color="bg-purple-900"
            subtitle={`${attendanceData.startDate} - ${attendanceData.endDate}`}
            animate={true}
          />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <motion.div 
                  className="lg:col-span-2 bg-[#232738] rounded-xl p-5 shadow-md border border-[#2a2f3e] overflow-hidden relative"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                  
                  <div className="flex justify-between items-center mb-4 relative">
                    <h3 className="text-lg font-medium text-gray-300">{t('weeklyAttendanceTrends')}</h3>
                    <div className="text-sm text-gray-400">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> {t('present')}
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 ml-3"></span> {t('absent')}
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <AdminLineChart data={attendanceData.days} />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  className="bg-[#232738] rounded-xl p-5 shadow-md border border-[#2a2f3e] overflow-hidden relative"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                  
                  <h3 className="text-lg font-medium mb-4 text-gray-300 relative">{t('attendanceDistribution')}</h3>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <AdminPieChart data={pieChartData} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminWeeklySummary data={attendanceData.days} />
                </motion.div>
                
                <motion.div 
                  className="lg:col-span-2" 
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminDailyAttendance data={attendanceData.days} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          className="bg-[#232738] rounded-xl p-5 shadow-md border border-[#2a2f3e] overflow-hidden relative"
          variants={itemVariants}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-300">{t('performanceSummary')}</h3>
            <div className="bg-blue-900/30 text-blue-300 py-1 px-3 rounded-full text-xs font-medium">
              {t('weeklyReport')}
            </div>
          </div>
          
          <div className="relative">
            <div className="flex flex-col space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">{t('overallAttendanceRate')}</span>
                  <span className="text-sm font-medium text-white">{summary.overallAttendanceRate}%</span>
                </div>
                <div className="w-full bg-[#1a1f2e] rounded-full h-2.5 mb-4">
                  <motion.div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${summary.overallAttendanceRate}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="bg-[#1a1f2e]/50 rounded-lg p-4 border border-[#2a2f3e]/50"
                  whileHover={{ y: -5, backgroundColor: "rgba(42, 47, 62, 0.5)" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">{t('bestDay')}</p>
                      <p className="text-white font-medium mt-1">{attendanceData.days.sort((a, b) => parseInt(b.attendanceRate) - parseInt(a.attendanceRate))[0].day}</p>
                    </div>
                    <div className="bg-green-900/30 p-2 rounded-lg">
                      <FaArrowUp className="text-green-400" />
                    </div>
                  </div>
                  <p className="text-green-400 text-lg font-bold mt-2">{attendanceData.days.sort((a, b) => parseInt(b.attendanceRate) - parseInt(a.attendanceRate))[0].attendanceRate}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-[#1a1f2e]/50 rounded-lg p-4 border border-[#2a2f3e]/50"
                  whileHover={{ y: -5, backgroundColor: "rgba(42, 47, 62, 0.5)" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">{t('averageAttendance')}</p>
                      <p className="text-white font-medium mt-1">{t('weekly')}</p>
                    </div>
                    <div className="bg-blue-900/30 p-2 rounded-lg">
                      <FaChartLine className="text-blue-400" />
                    </div>
                  </div>
                  <p className="text-blue-400 text-lg font-bold mt-2">{summary.overallAttendanceRate}%</p>
                </motion.div>
                
                <motion.div 
                  className="bg-[#1a1f2e]/50 rounded-lg p-4 border border-[#2a2f3e]/50"
                  whileHover={{ y: -5, backgroundColor: "rgba(42, 47, 62, 0.5)" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">{t('totalSessions')}</p>
                      <p className="text-white font-medium mt-1">{t('weekly')}</p>
                    </div>
                    <div className="bg-purple-900/30 p-2 rounded-lg">
                      <FaCalendarAlt className="text-purple-400" />
                    </div>
                  </div>
                  <p className="text-purple-400 text-lg font-bold mt-2">{attendanceData.days.length}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-white">{t('adminDashboard')}</h1>
      <div className="bg-[#232738] rounded-xl p-6 shadow-md">
        <p className="text-gray-300">{t('noAttendanceData')}</p>
        <motion.button 
          onClick={handleRetry}
          className="mt-4 bg-blue-800/30 hover:bg-blue-800/50 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaSync className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('retry')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DashHome;
