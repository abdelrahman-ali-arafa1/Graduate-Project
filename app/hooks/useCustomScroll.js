"use client";

import { useState, useEffect, useRef } from "react";

export function useCustomScroll() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Handle mouse events for custom scrolling
  const handleMouseDown = (e) => {
    // Check if we're clicking near the scrollbar area
    const container = containerRef.current;
    if (!container) return;
    
    const { right } = container.getBoundingClientRect();
    const isNearScrollbar = right - e.clientX < 20; // 20px from the right edge
    
    if (isNearScrollbar) {
      setIsDragging(true);
      setStartY(e.pageY);
      setScrollTop(container.scrollTop);
      e.preventDefault(); // Prevent text selection
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    
    const y = e.pageY;
    const walk = (y - startY) * 2; // Scroll speed multiplier
    container.scrollTop = scrollTop + walk;
  };
  
  // Add and remove event listeners
  useEffect(() => {
    const tableContainer = containerRef.current;
    if (tableContainer) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startY, scrollTop]);

  return {
    containerRef,
    isHovered,
    setIsHovered,
    handleMouseDown
  };
} 