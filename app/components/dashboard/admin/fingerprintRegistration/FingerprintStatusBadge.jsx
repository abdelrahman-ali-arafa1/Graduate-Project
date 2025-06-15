import React from 'react';

export default function FingerprintStatusBadge({ isEnrolled, fingerprintId }) {
  if (isEnrolled) {
    return (
      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-300 border border-green-800/30">
        Registered{fingerprintId ? ` (ID: ${fingerprintId})` : ''}
      </span>
    );
  }
  return (
    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/30 text-red-300 border border-red-800/30">
      Not Registered
    </span>
  );
} 