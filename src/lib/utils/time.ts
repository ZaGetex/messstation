/**
 * Time-related utility functions
 */

import { TimeStatus } from "@/types/sensor";
import { Translations } from "@/lib/config/translations";

/**
 * Calculates the time difference and returns status information
 * for sensor update indicators
 * 
 * @param timestamp - The timestamp to compare against current time
 * @param translations - Translation object for status text
 * @returns Time status with color class and text
 */
export function getTimeStatus(
  timestamp: Date,
  translations: Translations
): TimeStatus {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - timestamp.getTime()) / (1000 * 60)
  );

  if (diffInMinutes <= 1) {
    return { color: "bg-green-500", text: translations.timeStatus.now };
  } else if (diffInMinutes <= 5) {
    return {
      color: "bg-orange-500",
      text: `${diffInMinutes} ${translations.timeStatus.minutesAgo}`,
    };
  } else if (diffInMinutes <= 60) {
    return {
      color: "bg-red-500",
      text: `${diffInMinutes} ${translations.timeStatus.minutesAgo}`,
    };
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return {
      color: "bg-red-600",
      text: `${diffInHours}${translations.timeStatus.hoursAgo}`,
    };
  }
}

/**
 * Calculates the start date based on a time range key
 * 
 * @param range - Time range key (1h, 5h, 1d, 1w)
 * @returns Date object representing the start of the range
 */
export function getStartDateForRange(
  range: "1h" | "5h" | "1d" | "1w"
): Date {
  const now = new Date();
  switch (range) {
    case "1h":
      now.setHours(now.getHours() - 1);
      return now;
    case "5h":
      now.setHours(now.getHours() - 5);
      return now;
    case "1d":
      now.setDate(now.getDate() - 1);
      return now;
    case "1w":
      now.setDate(now.getDate() - 7);
      return now;
    default:
      // Default to 1 hour if range is invalid
      now.setHours(now.getHours() - 1);
      return now;
  }
}

/**
 * Calculates the start date for CSV export time spans
 * 
 * @param timeSpan - Time span key
 * @returns Date object representing the start of the time span, or undefined for custom
 */
export function getStartDateForTimeSpan(
  timeSpan: "1h" | "2h" | "6h" | "12h" | "1d" | "1w" | "custom"
): Date | undefined {
  if (timeSpan === "custom") {
    return undefined;
  }

  const now = new Date();
  const TIME_UNITS = {
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
  };

  switch (timeSpan) {
    case "1h":
      return new Date(now.getTime() - TIME_UNITS.HOUR);
    case "2h":
      return new Date(now.getTime() - 2 * TIME_UNITS.HOUR);
    case "6h":
      return new Date(now.getTime() - 6 * TIME_UNITS.HOUR);
    case "12h":
      return new Date(now.getTime() - 12 * TIME_UNITS.HOUR);
    case "1d":
      return new Date(now.getTime() - TIME_UNITS.DAY);
    case "1w":
      return new Date(now.getTime() - TIME_UNITS.WEEK);
    default:
      // Default to last 24 hours
      return new Date(now.getTime() - TIME_UNITS.DAY);
  }
}

