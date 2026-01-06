/**
 * Time range constants for history and export features
 */

/**
 * Time range keys for history chart
 */
export type HistoryRangeKey = "1h" | "5h" | "1d" | "1w";

/**
 * Time span keys for CSV export
 */
export type ExportTimeSpan = "1h" | "2h" | "6h" | "12h" | "1d" | "1w" | "custom";

/**
 * Milliseconds per time unit for calculations
 */
export const TIME_UNITS = {
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Default refresh interval for sensor data (30 seconds)
 */
export const SENSOR_REFRESH_INTERVAL = 30000;

