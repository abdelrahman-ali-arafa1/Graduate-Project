'use client';
import React from 'react';
import FingerprintRegistrationTable from '@/app/components/dashboard/admin/fingerprintRegistration/FingerprintRegistrationTable';

export default function FingerprintRegistrationPage() {
  // كل اللوجيك الخاص بجلب البيانات والتعامل مع الـ API سيكون في FingerprintRegistrationTable
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fingerprint Registration</h1>
      <FingerprintRegistrationTable />
    </div>
  );
} 