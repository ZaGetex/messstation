"use client";

import { useState, useEffect } from "react";

export default function DateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="text-center">
        <div className="text-lg sm:text-2xl font-bold text-text-primary dark:text-text-light mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-xs sm:text-sm text-primary-600 dark:text-primary-100">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
}
