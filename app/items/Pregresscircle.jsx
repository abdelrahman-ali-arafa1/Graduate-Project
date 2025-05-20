"use client"; // إذا كنت تستخدم Next.js 13+ مع App Router

import React from "react";

const CustomCircularProgress = ({ value, size = 100, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: size, height: size, margin: "auto" }}>
        <svg width={size} height={size}>
        
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F15041"
            strokeWidth={strokeWidth}
            fill="none"
          />
   
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2FDB7D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        {/* النسبة المئوية في المنتصف */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: `${size * 0.18}px`, // حجم النص يعتمد على حجم الدائرة
            fontWeight: "bold",
            color: "black",
          }}
        >
          {`${Math.round(value)}%`}
        </div>
      </div>

      {/* التسميات تحت الدائرة */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "12px", height: "12px", backgroundColor: "#2FDB7D", display: "inline-block", borderRadius: "2px" }}></span>
          <span style={{ fontSize: "14px", color: "#333" }}>Progress</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "12px", height: "12px", backgroundColor: "#F15041", display: "inline-block", borderRadius: "2px" }}></span>
          <span style={{ fontSize: "14px", color: "#333" }}>Absent</span>
        </div>
      </div>
    </div>
  );
};

export default function ProgressCircle() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <CustomCircularProgress value={30} size={150} strokeWidth={8} />
    </div>
  );
}
