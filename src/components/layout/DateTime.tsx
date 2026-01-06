/**
 * DateTime component for displaying current date and time
 * Updates every second and respects language settings
 */

"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DateTime() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { language } = useLanguage();

  useEffect(() => {
    setIsMounted(true);

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const locale = language === "de" ? "de-DE" : "en-US";

  return (
    <div className="p-2 sm:p-4">
      <div className="text-center">
        <div className="mb-1 text-lg font-bold sm:text-2xl text-text-primary dark:text-text-light">
          {currentTime.toLocaleTimeString(locale)}
        </div>
        <div className="text-xs sm:text-sm text-primary-600 dark:text-primary-100">
          {currentTime.toLocaleDateString(locale)}
        </div>
      </div>
    </div>
  );
}

