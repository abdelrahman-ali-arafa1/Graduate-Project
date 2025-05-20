import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from 'react-icons/fa';

const DocumentTable = ({ data, searchTerm, selectedFilter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 10;

  // Filter and sort data when dependencies change
  useEffect(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }
    
    // Apply category filter
    if (selectedFilter && selectedFilter !== 'all') {
      if (selectedFilter.includes('level')) {
        const level = selectedFilter.split(' ')[1];
        result = result.filter(item => 
          item.level?.toString() === level || 
          item.Level?.toString() === level
        );
      } else if (['cs', 'is', 'ai', 'bio'].includes(selectedFilter)) {
        result = result.filter(item => 
          (item.department?.toLowerCase() === selectedFilter) || 
          (item.Department?.toLowerCase() === selectedFilter)
        );
      }
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [data, searchTerm, selectedFilter, sortConfig]);

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get column headers from data
  const getHeaders = () => {
    if (data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem);
  };

  const headers = getHeaders();

  // Render sort icon based on current sort state
  const renderSortIcon = (header) => {
    if (sortConfig.key === header) {
      return sortConfig.direction === 'ascending' ? 
        <FaSortUp className="ml-1 text-blue-400" /> : 
        <FaSortDown className="ml-1 text-blue-400" />;
    }
    return <FaSort className="ml-1 text-gray-500 opacity-50" />;
  };

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#2a2f3e]">
        <table className="min-w-full divide-y divide-[#2a2f3e]">
          <thead className="bg-[#1a1f2e]">
            <tr>
              {headers.map((header) => (
                <th 
                  key={header} 
                  scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-[#232738] transition-colors"
                  onClick={() => requestSort(header)}
                >
                  <div className="flex items-center">
                    {header}
                    {renderSortIcon(header)}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#171b26] divide-y divide-[#2a2f3e]">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#1a1f2e] transition-colors"
                >
                  {headers.map((header) => (
                    <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {item[header]?.toString() || ''}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <div className="flex space-x-3">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <FaEdit />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="px-6 py-8 text-center text-gray-400">
                  No data found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 
                  ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed' 
                  : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e]'
              } transition-colors`}
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e]'
                  } transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages 
                  ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed' 
                  : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#2a2f3e]'
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTable; 