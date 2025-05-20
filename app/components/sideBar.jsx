"use client";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineDashboard, MdPeopleAlt, MdSubject } from "react-icons/md";
import { FaFolder, FaUserGraduate } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaMessage } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { BsClipboard2Check } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setInstructorRole } from "../Redux/Slices/userRole";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Sidebar = () => {
  const router = useRouter();
  const userRole = useSelector((state) => state.userRole.isAdmin);
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState("");

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

  const sidebarItems = userRole ? [
    { icon: <MdOutlineDashboard />, label: "Dashboard", href: "/dashboard/pages/home" },
    { icon: <MdPeopleAlt />, label: "Instructors", href: "/dashboard/pages/staff" },
    { icon: <FaFolder />, label: "Documents", href: "/dashboard/pages/document" },
    { icon: <SlCalender />, label: "Calendar", href: "#" },
    { icon: <FaMessage />, label: "Messages", href: "#" },
  ] : [
    { icon: <MdOutlineDashboard />, label: "Dashboard", href: "/dashboard" },
    { icon: <MdSubject />, label: "Subjects", href: "/dashboard/doctor/subjects" },
    { icon: <SlCalender />, label: "Take Attendance", href: "/dashboard/doctor/takeAttendance" },
    { icon: <BsClipboard2Check />, label: "Manual Attendance", href: "/dashboard/doctor/manualAttendance" },
    { icon: <MdPeopleAlt />, label: "Students", href: "/dashboard/doctor/students" },
    { icon: <MdPeopleAlt />, label: "Apology for attendance", href: "/dashboard/doctor/apology" },
    { icon: <SlCalender />, label: "Calendar", href: "/dashboard/doctor/calendar" },
    { icon: <FaMessage />, label: "Messages", href: "/dashboard/doctor/messages" },
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sidebar fixed top-0 left-0 h-screen w-64 bg-[var(--secondary-dark)] pt-24 shadow-lg z-10"
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex flex-col gap-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setActiveLink(item.label)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 
                ${activeLink === item.label 
                  ? "bg-[var(--primary)] text-white" 
                  : "text-[var(--foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"}`}
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
