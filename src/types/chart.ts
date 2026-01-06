/**
 * Chart-related type definitions
 */

import { SensorConfig } from "./sensor";

/**
 * Processed chart data structure
 */
export interface ProcessedChartData {
  /** Array of time labels for the X-axis */
  labels: string[];
  /** Datasets organized by sensor ID */
  datasets: Record<string, (number | null)[]>;
}

/**
 * Raw sensor data from API before processing
 */
export interface RawSensorData {
  /** ISO date string timestamp */
  ts: string;
  /** Sensor identifier */
  sensor: string;
  /** Numeric sensor value */
  value: number;
  /** Unit of measurement */
  unit: string;
}

/**
 * Chart range configuration
 */
export interface ChartRange {
  /** Range key identifier */
  key: "1h" | "5h" | "1d" | "1w";
  /** Localized label for the range */
  label: string;
}

