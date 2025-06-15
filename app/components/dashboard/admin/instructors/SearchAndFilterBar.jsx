"use client";

import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useLanguage } from "@/app/components/providers/LanguageProvider";

const SearchAndFilterBar = ({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, uniqueRoles }) => {
  const { t } = useLanguage();

  return (
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder={t('searchInstructors') || "Search instructors..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1a1f2e] text-white py-2.5 pl-10 pr-4 rounded-lg border border-[#2a2f3e] w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-blue-500/30"
          />
        </div>
        
        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#1a1f2e] text-white py-2.5 pl-10 pr-10 rounded-lg border border-[#2a2f3e] w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all hover:border-purple-500/30 appearance-none cursor-pointer"
          >
            <option value="">{t('allRoles') || 'All Roles'}</option>
            {uniqueRoles.map((role, index) => (
              <option key={role || `role-option-${index}`} value={role}>{role}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar; 