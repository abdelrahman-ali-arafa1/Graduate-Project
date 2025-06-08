"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

const InstructorLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available to display
      </div>
    );
  }

  // Determine the X-axis key based on data structure (for daily or weekly data)
  const xAxisKey = data[0].week ? 'week' : 'day';
  console.log("Line chart data:", data);
  console.log("Using X-axis key:", xAxisKey);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Determine if it's weekly or daily data
      const isWeekly = Boolean(payload[0]?.payload.week);
      
      return (
        <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg shadow-lg p-4 min-w-[180px]">
          <p className="text-white font-medium text-sm mb-2">
            {label}
            {isWeekly && payload[0].payload.from && payload[0].payload.to && (
              <span className="block text-xs text-gray-400 mt-1">
                {payload[0].payload.from} to {payload[0].payload.to}
              </span>
            )}
          </p>
          
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <p style={{ color: entry.color }} className="text-xs font-medium">
                  {entry.name}: {entry.value}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-2 pt-2 border-t border-[#2a2f3e]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <p className="text-xs font-medium text-blue-400">
                Attendance Rate: {payload[0].payload.attendanceRate}%
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3e" vertical={false} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6b7280" 
            tick={{ fill: '#9ca3af' }} 
            axisLine={{ stroke: '#2a2f3e' }}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fill: '#9ca3af' }} 
            axisLine={{ stroke: '#2a2f3e' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => {
              if (value === 'Present') return <span style={{ color: '#9ca3af' }}>Present</span>;
              if (value === 'Absent') return <span style={{ color: '#9ca3af' }}>Absent</span>;
              return <span style={{ color: '#9ca3af' }}>{value}</span>;
            }}
          />
          <Line
            type="monotone"
            dataKey="present"
            name="Present"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ fill: "#4ade80", r: 4 }}
            activeDot={{ r: 6, fill: "#4ade80", stroke: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="absent"
            name="Absent"
            stroke="#f87171"
            strokeWidth={2}
            dot={{ fill: "#f87171", r: 4 }}
            activeDot={{ r: 6, fill: "#f87171", stroke: "#fff" }}
          />
          <ReferenceLine y={0} stroke="#2a2f3e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InstructorLineChart; 