/**
 * Formatting utility functions for sensor values and display
 */

/**
 * Formats a sensor value with its unit
 * 
 * @param value - The numeric or string value
 * @param unit - The unit of measurement (optional)
 * @returns Formatted string with value and unit
 */
export function formatSensorValue(
  value: number | string,
  unit?: string | null
): string {
  if (unit) {
    return `${value} ${unit}`.trim();
  }
  return String(value);
}

