/**
 * API-related type definitions
 */

/**
 * Sensor data response from the API
 */
export interface SensorDataResponse {
  /** ISO date string timestamp */
  ts: string;
  /** Sensor identifier */
  sensor: string;
  /** Numeric sensor value */
  value: number;
  /** Unit of measurement (optional) */
  unit?: string | null;
}

/**
 * Latest sensor data API response structure
 * Key: sensorId, Value: sensor data or null
 */
export type LatestSensorDataResponse = {
  [key: string]: {
    value: number | string;
    unit?: string | null;
    ts: string;
  } | null;
};

/**
 * History chart API response
 */
export interface HistoryChartResponse {
  /** Array of sensor data points */
  data: SensorDataResponse[];
}

/**
 * Time range key for history queries
 */
export type RangeKey = "1h" | "5h" | "1d" | "1w";

/**
 * Time span key for CSV export
 */
export type TimeSpan = "1h" | "2h" | "6h" | "12h" | "1d" | "1w" | "custom";

/**
 * Data type selection for CSV export
 * Can be a sensor ID or "all"
 */
export type DataType = string;

