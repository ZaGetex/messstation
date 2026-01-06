/**
 * Chart utility functions for data processing and formatting
 */

import { SensorConfig } from "@/types/sensor";
import { RawSensorData, ProcessedChartData } from "@/types/chart";

/**
 * Dynamically processes the raw sensor data array from the API.
 * Groups data by timestamp and organizes it by sensor ID for Chart.js.
 * 
 * @param data - Raw array of SensorData objects from the API
 * @param sensorsToProcess - Array of sensor configurations to include
 * @returns Processed chart data with labels and datasets
 */
export function processChartData(
  data: RawSensorData[],
  sensorsToProcess: SensorConfig[]
): ProcessedChartData {
  const labels: string[] = [];
  // Create a map of sensor IDs to look for
  const sensorIdSet = new Set(sensorsToProcess.map((s) => s.sensorId));

  // Use a Map to group data by timestamp
  const dataByTimestamp = new Map<string, Record<string, number | null>>();
  // Use a Set to collect all unique timestamps
  const allTimestamps = new Set<string>();

  for (const reading of data) {
    // Only process sensors that are in our chart list
    if (sensorIdSet.has(reading.sensor)) {
      const ts = reading.ts;
      allTimestamps.add(ts);

      if (!dataByTimestamp.has(ts)) {
        // Initialize an entry for this timestamp
        const newEntry: Record<string, number | null> = {};
        for (const id of sensorIdSet) {
          newEntry[id] = null;
        }
        dataByTimestamp.set(ts, newEntry);
      }

      // Populate the sensor value
      dataByTimestamp.get(ts)![reading.sensor] = reading.value;
    }
  }

  // Sort timestamps chronologically
  const sortedTimestamps = Array.from(allTimestamps).sort();

  // Initialize the datasets object
  const datasets: Record<string, (number | null)[]> = {};
  for (const id of sensorIdSet) {
    datasets[id] = [];
  }

  // Build the final arrays
  for (const ts of sortedTimestamps) {
    // Format timestamp to "HH:mm"
    labels.push(
      new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const entry = dataByTimestamp.get(ts);
    for (const id of sensorIdSet) {
      datasets[id].push(entry ? entry[id] : null);
    }
  }

  return { labels, datasets };
}

/**
 * Converts a hex color code to rgba format with specified alpha
 * 
 * @param hex - Hex color code (e.g., "#e74c3c")
 * @param alpha - Alpha value between 0 and 1
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

