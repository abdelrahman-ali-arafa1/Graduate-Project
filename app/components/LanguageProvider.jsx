'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
const LanguageContext = createContext({
  language: 'ar',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isRTL: true,
  t: (key) => key,
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Translations
const translations = {
  ar: {
    // Common
    welcome: 'مرحباً بكم',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    loading: 'جاري التحميل...',
    fcaiAttendance: 'نظام الحضور الإلكتروني',
    fullTitle: 'نظام الحضور الإلكتروني لكلية الحاسبات والذكاء الاصطناعي',
    systemDescription: 'سجّل حضورك بسهولة وأمان باستخدام نظامنا المتطور للتعرف على رمز QR. تتبع الحضور والمشاركة في الفصول بكفاءة.',
    
    // Login page
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    enterUsername: 'أدخل اسم المستخدم',
    enterPassword: 'أدخل كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    loggingIn: 'جاري تسجيل الدخول...',
    welcomeBack: 'مرحباً بعودتك',
    pleaseSignIn: 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم',
    continueWith: 'أو تسجيل الدخول باستخدام',
    registerNow: 'سجل الآن',
    dontHaveAccount: 'ليس لديك حساب؟',
    
    // QR code attendance
    qrCodeAttendance: 'الحضور عبر رمز QR',
    scanQrCode: 'امسح رمز QR للتسجيل',
    attendanceTracking: 'تتبّع الحضور بسهولة',
    
    // Form validation
    usernameRequired: 'يرجى إدخال اسم المستخدم',
    passwordRequired: 'يرجى إدخال كلمة المرور',
    passwordTooShort: 'كلمة المرور قصيرة جداً',
    loginFailed: 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.',
    
    // Dashboard
    adminDashboard: 'لوحة تحكم المسؤول',
    instructorDashboard: 'لوحة تحكم المدرس',
    totalStudents: 'إجمالي الطلاب',
    present: 'حاضر',
    absent: 'غائب',
    reportingPeriod: 'فترة التقرير',
    forThePeriod: 'للفترة:',
    weeklyAttendanceTrends: 'اتجاهات الحضور الأسبوعية',
    attendanceDistribution: 'توزيع الحضور',
    weeklySummary: 'ملخص أسبوعي',
    dailyAttendance: 'الحضور اليومي',
    refresh: 'تحديث',
    loadingData: 'جاري تحميل البيانات...',
    errorLoadingData: 'خطأ في تحميل البيانات',
    serverConnectionError: 'لا يمكن الاتصال بالخادم',
    pleaseRefresh: 'يرجى تحديث الصفحة أو التواصل مع الدعم الفني.',
    retry: 'إعادة المحاولة',
    noAttendanceData: 'لا توجد بيانات حضور متاحة. يرجى المحاولة مرة أخرى لاحقاً.',
    last7Days: 'آخر 7 أيام',
    attendanceRate: 'معدل الحضور',
    
    // Weekly Summary
    totalPresent: 'إجمالي الحضور',
    totalAbsent: 'إجمالي الغياب',
    overallAttendanceRate: 'معدل الحضور الإجمالي',
    bestDay: 'أفضل يوم',
    lowestDay: 'أقل يوم',
    
    // Daily Attendance
    date: 'التاريخ',
    day: 'اليوم',
    rate: 'المعدل',
    status: 'الحالة',
    good: 'جيد',
    average: 'متوسط',
    poor: 'ضعيف',
    noData: 'لا توجد بيانات',

    // New Dashboard Elements
    overview: 'نظرة عامة',
    details: 'التفاصيل',
    performanceSummary: 'ملخص الأداء',
    weeklyReport: 'تقرير أسبوعي',
    averageAttendance: 'متوسط الحضور',
    totalSessions: 'إجمالي الجلسات',
    weekly: 'أسبوعي'
  },
  en: {
    // Common
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    loading: 'Loading...',
    fcaiAttendance: 'FCAI Attendance System',
    fullTitle: 'Electronic Attendance System for Faculty of Computers and AI',
    systemDescription: 'Track attendance effortlessly with our modern QR code system. Easy, secure, and efficient way to manage classroom participation.',
    
    // Login page
    username: 'Username',
    password: 'Password',
    enterUsername: 'Enter your username',
    enterPassword: 'Enter your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loggingIn: 'Logging in...',
    welcomeBack: 'Welcome Back',
    pleaseSignIn: 'Please sign in to access your dashboard',
    continueWith: 'Or continue with',
    registerNow: 'Register now',
    dontHaveAccount: 'Don\'t have an account?',
    
    // QR code attendance
    qrCodeAttendance: 'QR Code Attendance',
    scanQrCode: 'Scan QR code to check in',
    attendanceTracking: 'Track attendance easily',
    
    // Form validation
    usernameRequired: 'Please enter a username',
    passwordRequired: 'Please enter a password',
    passwordTooShort: 'Password is too short',
    loginFailed: 'Login failed. Please check your credentials.',
    
    // Dashboard
    adminDashboard: 'Admin Dashboard',
    instructorDashboard: 'Instructor Dashboard',
    totalStudents: 'Total Students',
    present: 'Present',
    absent: 'Absent',
    reportingPeriod: 'Reporting Period',
    forThePeriod: 'For the period:',
    weeklyAttendanceTrends: 'Weekly Attendance Trends',
    attendanceDistribution: 'Attendance Distribution',
    weeklySummary: 'Weekly Summary',
    dailyAttendance: 'Daily Attendance',
    refresh: 'Refresh',
    loadingData: 'Loading data...',
    errorLoadingData: 'Error Loading Data',
    serverConnectionError: 'Cannot connect to server',
    pleaseRefresh: 'Please refresh the page or contact support.',
    retry: 'Retry',
    noAttendanceData: 'No attendance data available. Please try again later.',
    last7Days: 'Last 7 Days',
    attendanceRate: 'Attendance Rate',
    
    // Weekly Summary
    totalPresent: 'Total Present',
    totalAbsent: 'Total Absent',
    overallAttendanceRate: 'Overall Attendance Rate',
    bestDay: 'Best Day',
    lowestDay: 'Lowest Day',
    
    // Daily Attendance
    date: 'Date',
    day: 'Day',
    rate: 'Rate',
    status: 'Status',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    noData: 'No data',

    // New Dashboard Elements
    overview: 'Overview',
    details: 'Details',
    performanceSummary: 'Performance Summary',
    weeklyReport: 'Weekly Report',
    averageAttendance: 'Average Attendance',
    totalSessions: 'Total Sessions',
    weekly: 'Weekly'
  },
};

// Language provider component
export function LanguageProvider({ children }) {
  // Use language from local storage if available, default to Arabic
  const [language, setLanguage] = useState('ar');
  const isRTL = language === 'ar';

  // Initialize language based on localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Update dir attribute and localStorage when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    localStorage.setItem('language', language);
  }, [language, isRTL]);

  // Toggle between Arabic and English
  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'ar' ? 'en' : 'ar'));
  };

  // Translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider; 