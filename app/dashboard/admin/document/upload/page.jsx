"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Redux actions and API
import { useAddStudentsSheetMutation } from "@/app/store/features/attendanceApiSlice";
import { setData } from "@/app/store/slices/dataUploadReducer";

// Components
import PageHeader from "@/app/components/dashboard/admin/document/PageHeader";
import LevelDepartmentFilter from "@/app/components/dashboard/admin/document/upload/LevelDepartmentFilter";
import FileUploadArea from "@/app/components/dashboard/admin/document/upload/FileUploadArea";
import FilePreview from "@/app/components/dashboard/admin/document/upload/FilePreview";
import StatusMessage from "@/app/components/dashboard/admin/document/upload/StatusMessage";

// Constants
import { isValidLevel, isValidDepartment } from "@/app/hooks/constants";

const DocumentUpload = () => {
  const [isRendered, setIsRendered] = useState(false);
  const fileInputRef = useRef(null);
  const uploadedData = useSelector((state) => state.dataUpload);
  const [addStudentsSheet] = useAddStudentsSheetMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  // State variables
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const [statusMessage, setStatusMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  // Check if data exists
  const hasData = Array.isArray(uploadedData) && uploadedData.length > 0;

  useEffect(() => {
    setIsRendered(true);
  }, []);

  // Helper function for status messages
  const showStatusMessage = useCallback((status, message, duration = 3000) => {
    setUploadStatus(status);
    setStatusMessage(message);
    
    setTimeout(() => {
      setUploadStatus(null);
      setStatusMessage('');
    }, duration);
  }, []);

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if filters are selected
  const areFiltersSelected = useCallback(() => {
    if (!selectedLevel || !selectedDepartment) {
      showStatusMessage("error", "Please select level and department before proceeding");
      return false;
    }
    return true;
  }, [selectedLevel, selectedDepartment, showStatusMessage]);

  // Validate the structure of Excel data
  const validateExcelColumns = (jsonData) => {
    const errors = [];
    
    // Check if data is empty
    if (jsonData.length === 0) {
      errors.push("The Excel file is empty. Please upload a file with data.");
      return errors;
    }
    
    // Validate required columns
    const requiredColumns = ['name', 'email'];
    const firstRow = jsonData[0];
    const headers = Object.keys(firstRow).map(key => key.toLowerCase());
    
    const missingColumns = requiredColumns.filter(col => 
      !headers.includes(col.toLowerCase())
    );
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}. At minimum, the Excel file must contain name and email columns.`);
    }
    
    return errors;
  };

  // Validate the content of Excel data
  const validateExcelContent = (jsonData) => {
    const errors = [];
    
    // Validate data format for each row
    jsonData.forEach((row, index) => {
      // Email validation
      const emailKey = Object.keys(row).find(key => key.toLowerCase() === 'email');
      if (emailKey && row[emailKey]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row[emailKey])) {
          errors.push(`Invalid email format in row ${index + 1}: ${row[emailKey]}`);
        }
      }
      
      // Level validation
      const levelKey = Object.keys(row).find(key => key.toLowerCase() === 'level');
      if (levelKey && row[levelKey]) {
        const level = row[levelKey].toString();
        if (!isValidLevel(level)) {
          errors.push(`Invalid level in row ${index + 1}: ${level}.`);
        }
      }
      
      // Department validation
      const deptKey = Object.keys(row).find(key => key.toLowerCase() === 'department');
      if (deptKey && row[deptKey]) {
        const dept = row[deptKey].toString().toUpperCase();
        if (!isValidDepartment(dept)) {
          errors.push(`Invalid department in row ${index + 1}: ${dept}.`);
        }
      }
    });
    
    return errors;
  };

  // Combined validation function
  const validateExcelData = (jsonData) => {
    const structureErrors = validateExcelColumns(jsonData);
    if (structureErrors.length > 0) return structureErrors;
    
    const contentErrors = validateExcelContent(jsonData);
    
    // Limit the number of errors shown
    if (contentErrors.length > 5) {
      const remainingErrors = contentErrors.length - 5;
      return [...contentErrors.slice(0, 5), `... and ${remainingErrors} more errors`];
    }
    
    return contentErrors;
  };

  // Check if data matches selected filters
  const validateFiltersMatch = (jsonData) => {
    return !jsonData.some(row => {
      const rowLevel = (row.level || row.Level || row.LEVEL || '').toString();
      const rowDept = (row.department || row.Department || row.DEPARTMENT || '').toString().toUpperCase();
      return (rowLevel && rowLevel !== selectedLevel) || (rowDept && rowDept !== selectedDepartment);
    });
  };

  // Add missing level or department if needed
  const addMissingColumns = (jsonData) => {
    const hasLevel = jsonData.length > 0 && Object.keys(jsonData[0]).some(key => key.toLowerCase() === 'level');
    const hasDepartment = jsonData.length > 0 && Object.keys(jsonData[0]).some(key => key.toLowerCase() === 'department');
    const hasPassword = jsonData.length > 0 && Object.keys(jsonData[0]).some(key => key.toLowerCase() === 'password');
    const hasPasswordConfirm = jsonData.length > 0 && Object.keys(jsonData[0]).some(key => key.toLowerCase() === 'passwordconfirm');

    return jsonData.map(row => {
      const newRow = { ...row };
      if (!hasLevel && selectedLevel) {
        newRow['level'] = selectedLevel;
      }
      if (!hasDepartment && selectedDepartment) {
        newRow['department'] = selectedDepartment;
      }
      // Add default password if missing
      if (!hasPassword) {
        newRow['password'] = 'password123';
      }
      // Add default passwordConfirm matching password if missing
      if (!hasPasswordConfirm) {
        newRow['passwordConfirm'] = newRow['password'] || 'password123';
      }
      return newRow;
    });
  };

  // Handle file upload click
  const handleUploadClick = (e) => {
    e.preventDefault();
    if (!areFiltersSelected()) return;
    fileInputRef.current?.click();
  };

  // Process Excel file
  const processExcelFile = (file) => {
    // Update file info
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setIsUploading(true);
    setValidationErrors([]);
    
    // Check file extension
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setIsUploading(false);
      showStatusMessage("error", "Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Parse Excel data
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheet);

        // Validate filters match
        if (!validateFiltersMatch(jsonData)) {
          setIsUploading(false);
          showStatusMessage("error", "All rows in the sheet must have the same level and department as selected in the filters.", 4000);
          return;
        }

        // Add missing columns if needed
        jsonData = addMissingColumns(jsonData);

        // Validate the data
        const errors = validateExcelData(jsonData);
        
        if (errors.length > 0) {
          setValidationErrors(errors);
          setIsUploading(false);
          showStatusMessage("error", "Validation errors found in the Excel file");
          return;
        }

        // Store in Redux
        dispatch(setData(jsonData));
        setIsUploading(false);
        showStatusMessage("success", "File uploaded successfully!");
      } catch (error) {
        console.error("Error processing file:", error);
        setIsUploading(false);
        showStatusMessage("error", "Failed to process Excel file. Please check the file format.");
      }
    };

    reader.readAsBinaryString(file);
  };

  // Event handlers
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processExcelFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!areFiltersSelected()) return;
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processExcelFile(file);
  };

  // Save data to server
  const handleFileSave = async () => {
    if (!hasData) return;
    
    setIsUploading(true);
    try {
      // Prepare students data with all required fields
      const studentsData = uploadedData.map(student => ({
        name: student.name || '',
        email: student.email || '',
        password: student.password || 'password123',
        passwordConfirm: student.passwordConfirm || 'password123',
        department: student.department || selectedDepartment || '',
        level: student.level || selectedLevel || ''
      }));
      
      console.log("Students data being sent:", studentsData);
      
      // Get token for authentication
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      
      // Try first with direct array approach
      try {
        console.log("Trying direct array approach...");
        const response = await fetch(
          "https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(studentsData)
          }
        );
        
        console.log("Response status:", response.status);
        
        // Check if the response has content
        const contentType = response.headers.get("content-type");
        let result = {};
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const text = await response.text();
            console.log("Raw response text:", text);
            if (text) {
              result = JSON.parse(text);
            }
          } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            result = { message: "Failed to parse server response" };
          }
        }
        
        if (response.ok) {
        showStatusMessage("success", "Data saved successfully!");
        dispatch(setData([])); // Clear the data
        setFileName("");
        setFileSize("");
          return;
        } else {
          console.error("First attempt failed, trying fallback...");
        }
      } catch (firstAttemptError) {
        console.error("Error in first attempt:", firstAttemptError);
      }
      
      // Fallback: try with one student at a time if bulk upload fails
      try {
        console.log("Trying fallback approach (one by one)...");
        let successCount = 0;
        
        for (const student of studentsData) {
          try {
            console.log(`Uploading student: ${student.name}`);
            const response = await fetch(
              "https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/studentInfo",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify([student]) // Send as array with single student
              }
            );
            
            if (response.ok) {
              successCount++;
            }
          } catch (err) {
            console.error(`Failed to upload student ${student.name}:`, err);
          }
        }
        
        if (successCount > 0) {
          showStatusMessage("success", `Successfully uploaded ${successCount} out of ${studentsData.length} students`);
          dispatch(setData([])); // Clear the data
          setFileName("");
          setFileSize("");
      } else {
          throw new Error("Failed to upload any students");
        }
      } catch (fallbackError) {
        console.error("Fallback attempt also failed:", fallbackError);
        showStatusMessage("error", "All upload attempts failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      showStatusMessage("error", "An unexpected error occurred: " + (error.message || "Please try again"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Status Message */}
      <StatusMessage 
        uploadStatus={uploadStatus} 
        statusMessage={statusMessage} 
      />
      
      {/* Back button */}
      <motion.button
        onClick={() => router.push('/dashboard/admin/document')}
        className="mb-6 flex items-center text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FaArrowLeft className="mr-2" /> Back to Document Management
      </motion.button>
      
      {/* Page Header */}
      <PageHeader 
        title="Upload Student Data" 
        subtitle="Upload and process student information from Excel files"
      />
      
      {/* Level & Department Filter */}
      <LevelDepartmentFilter 
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
      />
      
      {/* File Upload Area */}
      <FileUploadArea 
        isDragging={isDragging}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleUploadClick={handleUploadClick}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        isUploading={isUploading}
      />
      
      {/* File Preview */}
      <FilePreview 
        hasData={hasData}
        fileName={fileName}
        fileSize={fileSize}
        uploadedData={uploadedData}
        validationErrors={validationErrors}
        handleFileSave={handleFileSave}
        isUploading={isUploading}
      />
    </div>
  );
};

export default DocumentUpload; 