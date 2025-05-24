'use client';

import React, { useState, useEffect } from "react";
import Navbar from "../components/navBar";
import Sidebar from "../components/sideBar";
import DashboardPath from "../items/dashboardPath";
import ProtectedRoute from "../components/ProtectedRoute";
import PageTransition from "../components/PageTransition";
import ErrorProvider from "../components/ErrorManager";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { useLanguage } from "../components/LanguageProvider";
import { FaBars } from "react-icons/fa";

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // التحقق من حجم الشاشة
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  // إغلاق السايدبار تلقائيًا عند الضغط خارجه في وضع الموبايل
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && sidebarOpen && !e.target.closest('.sidebar')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);
  
  return (
    <ProtectedRoute>
      <ErrorProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <div className="flex flex-row relative">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
          
          <div 
            className={`flex-1 transition-all duration-300 p-4 sm:p-6 pt-20 sm:pt-24
              ${isMobile 
                ? 'ml-0' 
                : isRTL ? 'mr-64' : 'ml-64'
              }`}
          >
            {/* Hamburger button - only show on mobile when sidebar is closed */}
            {isMobile && !sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="fixed bottom-6 left-6 z-30 bg-primary text-white p-3 rounded-full shadow-lg"
              >
                <FaBars />
              </button>
            )}
            
            <DashboardPath />
            <div className="mt-4 rounded-xl bg-[var(--card-bg)] p-4 sm:p-6 shadow-lg overflow-x-auto">
              <AnimatePresence mode="wait">
                <PageTransition>
                  {children}
                </PageTransition>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      </ErrorProvider>
    </ProtectedRoute>
  );
};

export default Layout;
