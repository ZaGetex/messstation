/**
 * Custom hook for processing and managing chart data
 */

import { useState, useEffect, useMemo } from "react";
import { ProcessedChartData } from "@/types/chart";
import { SensorConfig } from "@/types/sensor";
import { RangeKey } from "@/types/api";
import { processChartData } from "@/lib/utils/chart";
import { sensorConfig } from "@/lib/config/sensors";

/**
 * Hook that fetches and processes chart data for the history page
 * 
 * @param range - Time range for the chart data
 * @returns Object containing chart data and loading state
 */
export function useChartData(range: RangeKey) {
  const [isLoading, setIsLoading] = useState(true);
  const [rawData, setRawData] = useState<any[]>([]);

  // Get sensors that should be displayed on the chart
  const chartSensors = useMemo(
    () => sensorConfig.filter((s) => s.showInHistory),
    []
  );

  // Fetch data from the API when the range changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/sensors/history?range=${range}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const apiResponse: { data: any[] } = await response.json();
        setRawData(apiResponse.data);
      } catch (error) {
        console.error(error);
        setRawData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  // Process data only for the sensors we want to chart
  const chartData: ProcessedChartData = useMemo(
    () => processChartData(rawData, chartSensors),
    [rawData, chartSensors]
  );

  return {
    chartData,
    isLoading,
    chartSensors,
  };
}

