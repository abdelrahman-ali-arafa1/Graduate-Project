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