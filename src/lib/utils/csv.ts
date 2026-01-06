/**
 * CSV utility functions for data export
 */

import type { SensorData } from "@prisma/client";

/**
 * Converts an array of SensorData objects into a CSV string.
 * This function is easily expandable by adding/removing fields from the headers array.
 * 
 * @param data - Array of SensorData objects from Prisma
 * @returns A string formatted as a CSV
 */
export function convertToCSV(data: SensorData[]): string {
  if (data.length === 0) {
    return "id,ts,cluster,sensor,value,unit\nNo data found for the selected criteria.";
  }

  // Define the headers for your CSV.
  // This is the main place to add/remove columns if your data model changes.
  const headers = ["id", "ts", "cluster", "sensor", "value", "unit"];

  // Create the header row
  const headerRow = headers.join(",") + "\n";

  // Map each data object to a CSV row
  const rows = data.map((row) => {
    // Escape commas within values by wrapping in double quotes
    const escape = (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      // If the string contains a comma, wrap it in double quotes
      if (str.includes(",")) return `"${str}"`;
      return str;
    };

    return [
      row.id,
      row.ts.toISOString(),
      escape(row.cluster),
      escape(row.sensor),
      row.value,
      escape(row.unit),
    ].join(",");
  });

  return headerRow + rows.join("\n");
}

