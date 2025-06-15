'use client';
import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFingerprint, FaSearch, FaUserCheck, FaUsers, FaPercent, FaFilter } from 'react-icons/fa';
import { useGetAllEnrollFingerprintsQuery, useFingerprintFirstRegisterMutation } from '@/app/store/features/fingerprintApiSlice';
import { useGetStudentsQuery } from '@/app/store/features/studentsApiSlice';
import FingerprintStatusBadge from './FingerprintStatusBadge';
import StatsCard from '@/app/components/ui/StatsCard';
import { Tooltip } from 'react-tooltip';

export default function FingerprintRegistrationTable() {
  // جلب بيانات الطلاب المسجلين بصمة
  const { data: enrolled, isLoading: isLoadingEnrolled, refetch: refetchEnrolled } = useGetAllEnrollFingerprintsQuery();
  const [registerFingerprint, { isLoading: isRegistering }] = useFingerprintFirstRegisterMutation();
  const { data: students, isLoading: isLoadingStudents, error: studentsError } = useGetStudentsQuery();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'registered', 'notRegistered'
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fingerprintIdInput, setFingerprintIdInput] = useState("");
  const [pending, setPending] = useState(false);
  const pollingRef = useRef(null);
  const timeoutRef = useRef(null);

  // استخراج الطلاب المسجلين بصمة (بدقة)
  const enrolledStudentIds = useMemo(() => {
    const set = new Set();
    (enrolled || []).forEach(e => {
      if (e.status === 'done' && e.studentId && e.studentId._id) {
        set.add(String(e.studentId._id));
      }
    });
    return set;
  }, [enrolled]);

  // استخراج بصمة كل طالب (لو موجود)
  const enrolledMap = useMemo(() => {
    const map = {};
    (enrolled || []).forEach(e => {
      if (e.status === 'done' && e.studentId?._id) {
        map[e.studentId._id] = e.fingerprintId;
      }
    });
    return map;
  }, [enrolled]);

  // فلترة الطلاب بناءً على البحث والفلتر الجديد
  const filteredStudents = useMemo(() => {
    if (!students?.data) return [];
    let currentStudents = students.data;

    // تطبيق فلتر البحث بالاسم
    if (search.trim()) {
      currentStudents = currentStudents.filter(student =>
        student.name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    // تطبيق فلتر حالة البصمة
    if (filterStatus === 'registered') {
      currentStudents = currentStudents.filter(student => enrolledStudentIds.has(String(student._id)));
    } else if (filterStatus === 'notRegistered') {
      currentStudents = currentStudents.filter(student => !enrolledStudentIds.has(String(student._id)));
    }

    return currentStudents;
  }, [students, search, filterStatus, enrolledStudentIds]);

  // حساب الإحصائيات
  const totalStudents = students?.data?.length || 0;
  const totalRegistered = enrolledStudentIds.size;
  const percentRegistered = totalStudents > 0 ? Math.round((totalRegistered / totalStudents) * 100) : 0;

  const openModal = (student) => {
    setSelectedStudent(student);
    setFingerprintIdInput("");
    setModalOpen(true);
    setPending(false);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setFingerprintIdInput("");
    setPending(false);
    clearInterval(pollingRef.current);
    clearTimeout(timeoutRef.current);
  };

  const handleRegister = async () => {
    if (!selectedStudent || !fingerprintIdInput) return;
    setPending(true);
    try {
      await registerFingerprint({ studentId: selectedStudent._id, fingerprintId: Number(fingerprintIdInput) }).unwrap();
      // ابدأ polling
      pollingRef.current = setInterval(async () => {
        const { data: latestEnrolled } = await refetchEnrolled();
        const found = (latestEnrolled || []).find(e => e.studentId?._id === selectedStudent._id && e.status === 'done');
        if (found) {
          clearInterval(pollingRef.current);
          clearTimeout(timeoutRef.current);
          setPending(false);
          closeModal();
        }
      }, 2000);
      // timeout بعد 30 ثانية
      timeoutRef.current = setTimeout(() => {
        clearInterval(pollingRef.current);
        setPending(false);
        alert('Timeout: Registration not confirmed. Please try again.');
      }, 30000);
    } catch (err) {
      setPending(false);
      alert('An error occurred during registration: ' + (err?.data?.message || err?.error || ''));
    }
  };

  // متغيرات منطقية للعرض
  const showLoading = isLoadingStudents || isLoadingEnrolled;
  const showError = studentsError;

  return (
    <motion.div className="w-full space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <motion.div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 p-8 border border-blue-800/30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Fingerprint Registration</span>
              <span className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-md border border-blue-500/30">{totalRegistered} Registered</span>
            </h1>
            <p className="text-blue-200/80 max-w-lg">Manage and view all students' fingerprint registration status. Register new fingerprints or monitor registration progress.</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Total Students" value={totalStudents} icon={<FaUsers size={24} className="text-blue-400" />} color="blue" description="All students" />
        <StatsCard title="Registered" value={totalRegistered} icon={<FaUserCheck size={24} className="text-green-400" />} color="green" description="With fingerprint" />
        <StatsCard title="Registration %" value={percentRegistered + '%'} icon={<FaPercent size={24} className="text-purple-400" />} color="purple" description="Registration rate" />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row items-center mb-4 gap-4">
        <div className="relative group flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#1a1f2e] text-white py-2.5 pl-10 pr-4 rounded-lg border border-[#2a2f3e] w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all hover:border-purple-500/30"
          />
        </div>

        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#1a1f2e] text-white py-2.5 pl-10 pr-10 rounded-lg border border-[#2a2f3e] w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all hover:border-purple-500/30 appearance-none cursor-pointer"
          >
            <option value="all">All Students</option>
            <option value="registered">Registered</option>
            <option value="notRegistered">Not Registered</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Modern Table Card Wrapper */}
      <motion.div className="w-full mt-6 rounded-2xl shadow-xl bg-gradient-to-br from-[#181c2a] to-[#232738] border border-[#2a2f3e] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar" style={{ maxHeight: '520px' }}>
          <table className="min-w-full divide-y divide-[#2a2f3e]">
            <thead>
              <tr className="bg-gradient-to-r from-[#232738] to-[#1a1f2e] text-white">
                <th className="px-6 py-5 text-center font-bold text-lg tracking-wide border-b border-[#2a2f3e] w-16">#</th>
                <th className="px-6 py-5 text-left font-bold text-lg tracking-wide border-b border-[#2a2f3e]">Student Name</th>
                <th className="px-6 py-5 text-center font-bold text-lg tracking-wide border-b border-[#2a2f3e]">
                  <span className="inline-flex items-center gap-2">
                    <FaFingerprint className="inline text-purple-400 text-xl" />Fingerprint Status
                  </span>
                </th>
                <th className="px-6 py-5 text-center font-bold text-lg tracking-wide border-b border-[#2a2f3e]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232738]">
              <AnimatePresence>
                {filteredStudents.map((student, idx) => {
                  const isEnrolled = enrolledStudentIds.has(String(student._id));
                  return (
                    <motion.tr
                      key={student._id}
                      className="hover:bg-[#232738]/80 transition-colors group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <td className="px-6 py-5 text-center text-gray-400 group-hover:text-white text-lg font-semibold">{idx + 1}</td>
                      <td className="px-6 py-5 font-semibold text-gray-100 group-hover:text-white whitespace-nowrap text-lg">{student.name}</td>
                      <td className="px-6 py-5 text-center">
                        <FingerprintStatusBadge isEnrolled={isEnrolled} fingerprintId={enrolledMap[student._id]} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        {isEnrolled ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-300 border border-green-800/30">
                            Registered
                          </span>
                        ) : (
                          <button
                            className="p-2 rounded-lg bg-[#232738] hover:bg-[#2a2f3e] transition-colors text-purple-300 hover:text-purple-200 focus:outline-none"
                            onClick={() => openModal(student)}
                            disabled={isRegistering}
                            title="Register Fingerprint"
                          >
                            <FaFingerprint size={18} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80 p-8 rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg mb-4">
                <FaFingerprint size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Register Fingerprint</h2>
              <div className="text-lg text-blue-200 font-semibold mb-2">{selectedStudent?.name}</div>
            </div>
            {pending ? (
              <div className="text-center text-yellow-400 font-semibold mb-4">Registering fingerprint... Please wait</div>
            ) : (
              <>
                <div className="mb-6 w-full">
                  <label className="block text-gray-300 mb-2 text-sm">Fingerprint ID</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFingerprintIdInput(val => String(Math.max(1, Number(val || 1) - 1)))}
                      className="w-8 h-8 flex items-center justify-center rounded bg-[#232738] hover:bg-[#2a2f3e] text-purple-300 text-lg font-bold transition"
                      tabIndex={-1}
                    >-</button>
                    <input
                      type="number"
                      min="1"
                      value={fingerprintIdInput}
                      onChange={e => setFingerprintIdInput(e.target.value.replace(/^0+/, ''))}
                      className="w-full px-4 py-3 rounded-lg bg-[#1a1f2e] text-white border border-[#a78bfa] focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg shadow-sm placeholder-gray-400 no-spinner"
                      style={{ MozAppearance: 'textfield' }}
                    />
                    <button
                      type="button"
                      onClick={() => setFingerprintIdInput(val => String(Number(val || 0) + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded bg-[#232738] hover:bg-[#2a2f3e] text-purple-300 text-lg font-bold transition"
                      tabIndex={-1}
                    >+</button>
                  </div>
                </div>
                <div className="flex gap-4 justify-end w-full">
                  <button onClick={closeModal}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700 text-white text-xl shadow transition-all"
                    title="Cancel"
                  >
                    <span className="sr-only">Cancel</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button onClick={handleRegister} disabled={isRegistering || !fingerprintIdInput}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xl shadow transition-all disabled:opacity-50"
                    title="Register"
                  >
                    <span className="sr-only">Register</span>
                    <FaFingerprint size={24} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* CSS for custom-scrollbar (يمكنك إضافتها في ملف CSS عام أو داخل style jsx global)
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6d28d9 30%, #2563eb 100%);
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #181c2a;
  border-radius: 8px;
}
*/

/* CSS لإخفاء الأسهم الافتراضية:
input[type=number].no-spinner::-webkit-inner-spin-button,
input[type=number].no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number].no-spinner {
  -moz-appearance: textfield;
}
*/ 