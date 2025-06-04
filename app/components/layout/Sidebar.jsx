"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdOutlineDashboard, MdPeopleAlt, MdSubject } from "react-icons/md";
import { FaFolder, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaMessage } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setInstructorRole } from "@/app/Redux/Slices/userRole";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { hydrate } from "@/app/Redux/Slices/selectedCourseSlice";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userRole = useSelector((state) => state.userRole.isAdmin);
  const selectedCourse = useSelector((state) => state.selectedCourse?.course);
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle menu toggle for mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = (label) => {
    setActiveLink(label);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // handle logout 
  const handleLogout = () => {
    // مسح جميع بيانات المستخدم من التخزين المحلي
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isInstructor");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("selectedCourse");
    
    // توجيه المستخدم إلى صفحة تسجيل الدخول
    router.push("/auth/login");
  }

  // Handle manual attendance navigation
  const handleManualAttendanceClick = (e) => {
    e.preventDefault();
    
    // Check if a course is selected
    if (!selectedCourse) {
      // No course selected, redirect to subjects page to select a course
      alert("Please select a course first");
      router.push("/dashboard/doctor/subjects");
    } else {
      // Course is selected, navigate to manual attendance page
      router.push("/dashboard/doctor/manualAttendance");
    }
    
    setActiveLink("Manual Attendance");
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Define sidebar items
  const sidebarItems = userRole ? [
    { icon: <MdOutlineDashboard />, label: "Dashboard", href: "/dashboard" },
    { icon: <MdPeopleAlt />, label: "Instructors", href: "/dashboard/pages/staff" },
    { icon: <FaFolder />, label: "Documents", href: "/dashboard/pages/document" },
    { icon: <FaMessage />, label: "Messages", href: "/dashboard/messages" },
  ] : [
    { icon: <MdOutlineDashboard />, label: "Dashboard", href: "/dashboard/doctor" },
    { icon: <MdSubject />, label: "Subjects", href: "/dashboard/doctor/subjects" },
    { icon: <FaClipboardList />, label: "Take Attendance", href: "/dashboard/doctor/takeAttendance" },
    { icon: <FaClipboardList />, label: "Manual Attendance", href: "#", onClick: handleManualAttendanceClick },
    { icon: <MdPeopleAlt />, label: "Students", href: "/dashboard/doctor/students" },
    { icon: <MdPeopleAlt />, label: "Apology for attendance", href: "/dashboard/doctor/apology" },
    { icon: <FaMessage />, label: "Messages", href: "/dashboard/doctor/messages" },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  // Hydrate selected course from localStorage on component mount
  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  // Set active link based on current path
  useEffect(() => {
    // Check exact matches first
    const exactMatch = sidebarItems.find(item => pathname === item.href);
    if (exactMatch) {
      setActiveLink(exactMatch.label);
      return;
    }
    
    // Then check path includes for nested routes
    for (const item of sidebarItems) {
      // Skip items with # as href
      if (item.href === "#") continue;
      
      // Check if pathname includes the item's href and the href is not just "/"
      // to avoid matching everything with the dashboard root
      if (pathname.includes(item.href) && item.href !== "/dashboard") {
        setActiveLink(item.label);
        return;
      }
    }
    
    // Special case for dashboard root path
    if (pathname === "/dashboard" || pathname === "/dashboard/doctor") {
      setActiveLink("Dashboard");
    }
    
    console.log("Current pathname:", pathname);
    console.log("Active link set to:", activeLink);
  }, [pathname, sidebarItems]);

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <motion.button
      onClick={toggleMobileMenu}
      className="fixed top-4 left-4 z-50 p-2 rounded-full bg-[#1a1c2a]/90 text-gray-300 shadow-lg border border-[#2c2f42] lg:hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isMobileMenuOpen ? (
        <FaTimes className="text-xl" />
      ) : (
        <FaBars className="text-xl" />
      )}
    </motion.button>
  );

  return (
    <>
      <MobileMenuButton />
      
      <AnimatePresence>
        {(!isMobile || isMobileMenuOpen) && (
          <motion.div 
            initial={{ x: isMobile ? -280 : -250 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? -280 : -250 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`sidebar fixed top-0 left-0 h-screen ${isMobile ? 'w-[80%] max-w-[280px]' : 'w-64'} bg-[#1a1c2a] pt-24 shadow-lg z-20`}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex-1 flex flex-col gap-2">
                {sidebarItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={item.onClick || (() => handleLinkClick(item.label))}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 
                      ${activeLink === item.label 
                        ? "bg-[#7950f2] text-white" 
                        : "text-gray-300 hover:bg-[#2c2f42] hover:text-white"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xl"
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 mt-4 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <IoLogOut className="text-xl" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop for mobile */}
      {isMobileMenuOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-10"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
