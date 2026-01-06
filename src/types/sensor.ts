/**
 * Sensor-related type definitions
 */

import { LucideIcon } from "lucide-react";

/**
 * Configuration interface for a single sensor
 * Contains all display, formatting, and behavior settings
 */
export interface SensorConfig {
  // --- Universal Properties ---
  /** The unique identifier used in the database (e.g., "temperature") */
  sensorId: string;
  /** The German display title (e.g., "Temperatur") */
  title: string;
  /** The English display title (e.g., "Temperature") */
  titleEn: string;
  /** The unit of measurement (e.g., "°C", "%", "hPa") */
  unit?: string;
  /** The icon component from lucide-react */
  icon: LucideIcon;

  // --- Dashboard Card Styling ---
  /** Function to format the sensor value for display */
  formatting: (value: number) => string;
  /** Tailwind CSS class for icon color */
  iconColor: string;
  /** Tailwind CSS class for card shadow color */
  shadowColor: string;
  /** Tailwind CSS class for card border color on hover */
  borderColor: string;
  /** Tailwind CSS class for text color on hover */
  hoverTextColor: string;

  // --- History & Download Settings ---
  /** Whether to show this sensor on the history chart */
  showInHistory: boolean;
  /** Whether to include this sensor in CSV download options */
  showInDownload: boolean;
  /** German description for the download modal */
  description: string;
  /** English description for the download modal */
  descriptionEn: string;

  // --- History Chart Configuration ---
  /** Hex color code for the chart line (e.g., "#e74c3c") */
  chartColor: string;
  /** Which Y-axis to use for this sensor (default: "y") */
  chartYAxis?: "y" | "y2";
}

/**
 * Sensor data state type for storing formatted values
 * Key: sensorId, Value: formatted string (e.g., "21.5 °C")
 */
export type SensorDataState = {
  [key: string]: string;
};

/**
 * Sensor last updated state type for tracking timestamps
 * Key: sensorId, Value: Date object
 */
export type SensorLastUpdatedState = {
  [key: string]: Date;
};

/**
 * Time status information for sensor update indicators
 */
export interface TimeStatus {
  /** Tailwind CSS class for the status indicator color */
  color: string;
  /** Human-readable status text */
  text: string;
}

/**
 * Sensor card data structure for rendering dashboard cards
 */
export interface SensorCardData extends SensorConfig {
  /** The formatted display value */
  value: string;
  /** Last update timestamp */
  lastUpdated: Date;
  /** The icon component instance */
  Icon: LucideIcon;
  /** Calculated time status */
  timeStatus: TimeStatus;
}

/**
 * Multi-sensor card data structure
 */
export interface MultiSensorCardData {
  /** Sensor configuration */
  config: SensorConfig;
  /** Formatted display value */
  value: string;
  /** Last update timestamp */
  lastUpdated: Date;
  /** Calculated time status */
  timeStatus: TimeStatus;
}

