'use client';

import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import PageTransition from "../../components/PageTransition";
import { AnimatePresence } from "framer-motion";

export default function DoctorLayout({ children }) {
  return (
    <ProtectedRoute>
      <AnimatePresence mode="wait">
        <PageTransition>
          {children}
        </PageTransition>
      </AnimatePresence>
    </ProtectedRoute>
  );
} 