"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetAllAttendancesQuery } from "@/app/Redux/features/attendanceApiSlice";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaUserGraduate,
  FaBookOpen,
} from "react-icons/fa";

const Page = () => {
  const router = useRouter();
  const selectedCourse = useSelector((state) => state.selectedCourse.course);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, department, attendance
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  // استخدام الـ hook للحصول على بيانات الطلاب
  const {
    data: attendanceData,
    isLoading,
    error,
    refetch,
  } = useGetAllAttendancesQuery(selectedCourse?._id || "", {
    skip: !selectedCourse,
  });

  // تأكد من تحميل البيانات عند تغيير المقرر المحدد
  useEffect(() => {
    if (selectedCourse) {
      refetch();
    }
  }, [selectedCourse, refetch]);

  // تحويل البيانات للعرض وتطبيق البحث والتصفية والترتيب
  const getFilteredAndSortedStudents = () => {
    if (!attendanceData || !attendanceData.students) return [];

    let filteredStudents = [...attendanceData.students];

    // تطبيق البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (item) =>
          item.student.name.toLowerCase().includes(term) ||
          item.student.email.toLowerCase().includes(term)
      );
    }

    // تطبيق التصفية حسب القسم
    if (filterDepartment) {
      filteredStudents = filteredStudents.filter(
        (item) => item.student.department === filterDepartment
      );
    }

    // تطبيق الترتيب
    filteredStudents.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "name":
          valueA = a.student.name.toLowerCase();
          valueB = b.student.name.toLowerCase();
          break;
        case "department":
          valueA = a.student.department.toLowerCase();
          valueB = b.student.department.toLowerCase();
          break;
        case "attendance":
          valueA = a.studentAttendanc;
          valueB = b.studentAttendanc;
          break;
        default:
          valueA = a.student.name.toLowerCase();
          valueB = b.student.name.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filteredStudents;
  };

  // استخراج قائمة الأقسام المتاحة للتصفية
  const getDepartments = () => {
    if (!attendanceData || !attendanceData.students) return [];
    const departments = new Set();
    attendanceData.students.forEach((item) => {
      if (item.student.department) {
        departments.add(item.student.department);
      }
    });
    return Array.from(departments);
  };

  // تبديل ترتيب العرض
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // تغيير معيار الترتيب
  const changeSortBy = (criteria) => {
    if (sortBy === criteria) {
      toggleSortOrder();
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  // إذا لم يتم اختيار مقرر، عرض رسالة
  if (!selectedCourse) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[400px]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-[var(--secondary)] rounded-xl p-8 shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[var(--primary-light)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBookOpen className="text-[var(--primary)] text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">
            No Course Selected
          </h2>
          <p className="text-[var(--foreground-secondary)] mb-6">
            Please select a course to view student data
          </p>
          <motion.button
            onClick={() => router.push("/dashboard/doctor/subjects?from=students")}
            className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaBookOpen className="text-lg" />
            <span>Select Course</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 border-t-[var(--primary)] rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[400px] flex justify-center items-center"
      >
        <div className="bg-red-900/20 text-red-400 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-medium mb-2">Error Loading Student Data</h2>
          <p>{error.message || "Failed to load student data. Please try again."}</p>
          <button
            onClick={refetch}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  const filteredStudents = getFilteredAndSortedStudents();
  const departments = getDepartments();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Students List
        </h1>
        <p className="text-[var(--foreground-secondary)]">
          View and manage students enrolled in {selectedCourse.courseName} course
        </p>
      </motion.div>

      {/* معلومات المقرر */}
      <motion.div
        className="bg-[var(--secondary)] rounded-xl p-6 shadow-md border-l-4 border-[var(--primary)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              {selectedCourse.courseName}
            </h2>
            <div className="flex items-center gap-3">
              <span className="bg-[var(--background-secondary)] text-[var(--foreground-secondary)] text-sm px-2 py-1 rounded-full">
                {selectedCourse.department}
              </span>
              <span className="text-[var(--foreground-secondary)] text-sm">
                Level {selectedCourse.level}
              </span>
              <span className="text-[var(--foreground-secondary)] text-sm">
                Semester {selectedCourse.semester || "1"}
              </span>
            </div>
          </div>
          <div className="bg-[var(--background-secondary)] px-3 py-1 rounded-full text-sm flex items-center">
            <FaUserGraduate className="mr-2 text-[var(--primary)]" />
            <span>{filteredStudents.length} Students</span>
          </div>
        </div>
      </motion.div>

      {/* أدوات البحث والتصفية */}
      <motion.div
        className="bg-[var(--secondary)] rounded-xl p-4 sm:p-5 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          {/* البحث */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-[var(--foreground-secondary)] text-sm" />
            </div>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 text-sm bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* تصفية حسب القسم */}
          <div className="md:w-1/4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-[var(--foreground-secondary)] text-sm" />
            </div>
            <select
              className="w-full py-2 pl-10 pr-4 text-sm bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* ترتيب */}
          <div className="md:w-1/4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSort className="text-[var(--foreground-secondary)] text-sm" />
            </div>
            <select
              className="w-full py-2 pl-10 pr-4 text-sm bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-");
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="department-asc">Department (A-Z)</option>
              <option value="department-desc">Department (Z-A)</option>
              <option value="attendance-desc">Attendance (Highest First)</option>
              <option value="attendance-asc">Attendance (Lowest First)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* جدول الطلاب */}
      <motion.div
        className="bg-[var(--secondary)] rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-transparent">
            <table className="min-w-full divide-y divide-[var(--border-color)]">
              <thead className="bg-[var(--background-secondary)]">
                <tr>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider cursor-pointer"
                    onClick={() => changeSortBy("name")}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      {sortBy === "name" && (
                        <span className="ml-1 sm:ml-2">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider hidden md:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                    onClick={() => changeSortBy("department")}
                  >
                    <div className="flex items-center">
                      <span>Dept</span>
                      {sortBy === "department" && (
                        <span className="ml-1 sm:ml-2">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider cursor-pointer"
                    onClick={() => changeSortBy("attendance")}
                  >
                    <div className="flex items-center">
                      <span>Att.</span>
                      {sortBy === "attendance" && (
                        <span className="ml-1 sm:ml-2">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--secondary)] divide-y divide-[var(--border-color)]">
                {filteredStudents.map((item) => (
                  <motion.tr
                    key={item.student._id}
                    className="hover:bg-[var(--background-secondary)] transition-colors"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-[var(--foreground)]">
                      <div className="flex flex-col sm:hidden">
                        <span>{item.student.name}</span>
                        <span className="text-xs text-[var(--foreground-secondary)] mt-0.5">{item.student.department}</span>
                      </div>
                      <span className="hidden sm:block">{item.student.name}</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-[var(--foreground-secondary)] hidden md:table-cell">
                      {item.student.email}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-[var(--foreground-secondary)] hidden sm:table-cell">
                      <span className="px-1.5 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[var(--background-secondary)] text-[var(--foreground)]">
                        {item.student.department}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-[var(--foreground-secondary)]">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.studentAttendanc > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.studentAttendanc}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 sm:py-10 text-center text-xs sm:text-sm text-[var(--foreground-secondary)]">
            No student data available
          </div>
        )}
      </motion.div>

      {/* Mobile Pagination - Show for small screens only */}
      {filteredStudents.length > 10 && (
        <div className="mt-4 sm:mt-6 lg:hidden flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            <button className="px-3 py-1 border border-[var(--border-color)] rounded-l-md text-xs text-[var(--foreground-secondary)] bg-[var(--secondary)] hover:bg-[var(--background-secondary)]">
              Previous
            </button>
            <button className="px-3 py-1 border-t border-b border-r border-[var(--border-color)] text-xs text-white bg-[var(--primary)]">
              1
            </button>
            <button className="px-3 py-1 border-t border-b border-r border-[var(--border-color)] text-xs text-[var(--foreground-secondary)] bg-[var(--secondary)] hover:bg-[var(--background-secondary)]">
              2
            </button>
            <button className="px-3 py-1 border-t border-b border-r border-[var(--border-color)] rounded-r-md text-xs text-[var(--foreground-secondary)] bg-[var(--secondary)] hover:bg-[var(--background-secondary)]">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page; 