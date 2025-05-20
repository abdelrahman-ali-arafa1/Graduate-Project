"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdOutlineDashboard, MdPeopleAlt, MdSubject } from "react-icons/md";
import { FaFolder, FaClipboardList } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaMessage } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setInstructorRole } from "@/app/Redux/Slices/userRole";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { hydrate } from "@/app/Redux/Slices/selectedCourseSlice";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userRole = useSelector((state) => state.userRole.isAdmin);
  const selectedCourse = useSelector((state) => state.selectedCourse?.course);
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState("");

  // Hydrate selected course from localStorage on component mount
  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  // Set active link based on current path
  useEffect(() => {
    if (pathname.includes('/dashboard/pages/staff')) {
      setActiveLink('Instructors');
    } else if (pathname.includes('/dashboard/pages/document')) {
      setActiveLink('Documents');
    } else if (pathname.includes('/dashboard/calendar')) {
      setActiveLink('Calendar');
    } else if (pathname.includes('/dashboard/messages')) {
      setActiveLink('Messages');
    } else if (pathname.includes('/dashboard/doctor/subjects')) {
      setActiveLink('Subjects');
    } else if (pathname.includes('/dashboard/doctor/takeAttendance')) {
      setActiveLink('Take Attendance');
    } else if (pathname.includes('/dashboard/doctor/manualAttendance')) {
      setActiveLink('Manual Attendance');
    } else if (pathname === '/dashboard') {
      setActiveLink('Dashboard');
    }
  }, [pathname]);

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
  };

  const sidebarItems = userRole ? [
    { icon: <MdOutlineDashboard />, label: "Dashboard", href: "/dashboard" },
    { icon: <MdPeopleAlt />, label: "Instructors", href: "/dashboard/pages/staff" },
    { icon: <FaFolder />, label: "Documents", href: "/dashboard/pages/document" },
    { icon: <SlCalender />, label: "Calendar", href: "/dashboard/calendar" },
    { icon: <FaMessage />, label: "Messages", href: "/dashboard/messages" },
  ] : [
    { icon: <MdOutlineDashboard />, label: "Dashboard", href: "/dashboard" },
    { icon: <MdSubject />, label: "Subjects", href: "/dashboard/doctor/subjects" },
    { icon: <SlCalender />, label: "Take Attendance", href: "/dashboard/doctor/takeAttendance" },
    { icon: <FaClipboardList />, label: "Manual Attendance", href: "#", onClick: handleManualAttendanceClick },
    { icon: <MdOutlineDashboard />, label: "Subject Management", href: "/dashboard/doctor" },
    { icon: <MdPeopleAlt />, label: "Apology for attendance", href: "/dashboard/doctor/apology" },
    { icon: <SlCalender />, label: "Calendar", href: "/dashboard/calendar" },
    { icon: <FaMessage />, label: "Messages", href: "/dashboard/doctor/messages" },
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sidebar fixed top-0 left-0 h-screen w-64 bg-[#1a1c2a] pt-24 shadow-lg z-10"
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex flex-col gap-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={item.onClick || (() => setActiveLink(item.label))}
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
  );
};

export default Sidebar;
