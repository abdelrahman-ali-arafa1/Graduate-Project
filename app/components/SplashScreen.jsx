'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useLanguage } from './LanguageProvider';

export default function SplashScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // تقدم التحميل من 0 إلى 100
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newValue = prev + Math.floor(Math.random() * 10) + 2;
        return newValue > 100 ? 100 : newValue;
      });
    }, 150);

    // إخفاء الشاشة بعد اكتمال التحميل
    if (loadingProgress === 100) {
      setTimeout(() => {
        setFadeOut(true);
      }, 500);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loadingProgress]);

  // عناصر زخرفية
  const decorativeElements = [
    { top: '15%', left: '10%', size: 20, delay: 0 },
    { top: '10%', right: '15%', size: 30, delay: 0.3 },
    { bottom: '20%', left: '20%', size: 25, delay: 0.7 },
    { bottom: '15%', right: '20%', size: 15, delay: 1 },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* عناصر زخرفية */}
      {decorativeElements.map((element, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-primary opacity-30 animate-pulse"
          style={{
            top: element.top,
            left: element.left,
            right: element.right,
            bottom: element.bottom,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}

      <div className="w-full max-w-sm text-center px-4">
        {/* شعار المؤسسة */}
        <div className="mb-8 relative w-40 h-40 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgressbar
              value={loadingProgress}
              strokeWidth={5}
              styles={buildStyles({
                pathColor: 'var(--primary)',
                trailColor: 'rgba(200, 200, 200, 0.2)',
                pathTransition: 'stroke-dashoffset 0.3s ease',
              })}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image
              src="/images/logo.png"
              alt="FCAI Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-4 animate-fadeIn">
          {t('fcaiAttendance')}
        </h1>

        {/* شريط التقدم */}
        <div className="w-full h-2 bg-neutral-light rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        
        <p className="text-foreground-secondary mt-2">
          {t('loading')} {loadingProgress}%
        </p>
      </div>
      
      {/* خلفية زخرفية */}
      <div className="absolute bottom-0 left-0 w-full h-40 opacity-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-full"
        >
          <path
            fill="var(--primary)"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-wave"
          ></path>
        </svg>
      </div>
    </div>
  );
} 