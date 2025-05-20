'use client';

import React from "react";
import Navbar from "../components/navBar";
import Sidebar from "../components/sideBar";
import DashboardPath from "../items/dashboardPath";
import ProtectedRoute from "../components/ProtectedRoute";
import PageTransition from "../components/PageTransition";
import ErrorProvider from "../components/ErrorManager";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { useLanguage } from "../components/LanguageProvider";

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  
  return (
    <ProtectedRoute>
      <ErrorProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Navbar />
        <div className="flex flex-row">
          <Sidebar />
          <div className={`flex-1 transition-all duration-300 p-6 pt-24 ${isRTL ? 'pr-72' : 'pl-72'}`}>
            <DashboardPath />
            <div className="mt-4 rounded-xl bg-[var(--card-bg)] p-6 shadow-lg">
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
