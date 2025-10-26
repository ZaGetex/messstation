"use client";

import { useState, useEffect } from "react";

export default function DateTime() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setIsMounted(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="text-center">
        <div className="mb-1 text-lg font-bold sm:text-2xl text-text-primary dark:text-text-light">
          {currentTime.toLocaleTimeString()}
        </div>
        <div className="text-xs sm:text-sm text-primary-600 dark:text-primary-100">
          {currentTime.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
