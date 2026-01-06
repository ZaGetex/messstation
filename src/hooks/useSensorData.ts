/**
 * Custom hook for fetching and managing sensor data
 */

import { useState, useEffect } from "react";
import { SensorDataState, SensorLastUpdatedState } from "@/types/sensor";
import { LatestSensorDataResponse } from "@/types/api";
import { sensorConfig } from "@/lib/config/sensors";
import { SENSOR_REFRESH_INTERVAL } from "@/lib/constants/timeRanges";

/**
 * Hook that fetches and manages the latest sensor data
 * Automatically refreshes data at regular intervals
 * 
 * @returns Object containing sensor data state and last updated timestamps
 */
export function useSensorData() {
  // Initialize state dynamically based on sensorConfig
  const [data, setData] = useState<SensorDataState>(() => {
    const initialState: SensorDataState = {};
    sensorConfig.forEach((sensor) => {
      initialState[sensor.sensorId] = "N/A";
    });
    return initialState;
  });

  const [lastUpdated, setLastUpdated] = useState<SensorLastUpdatedState>(() => {
    const initialState: SensorLastUpdatedState = {};
    sensorConfig.forEach((sensor) => {
      initialState[sensor.sensorId] = new Date(Date.now());
    });
    return initialState;
  });

  // Fetch latest sensor data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sensors/latest");
        if (!response.ok) throw new Error("Failed to fetch data");
        const latest: LatestSensorDataResponse = await response.json();

        // Update state dynamically based on sensor config
        setData((prevData) => {
          const newData = { ...prevData };
          for (const sensor of sensorConfig) {
            const sensorApiData = latest[sensor.sensorId];
            if (sensorApiData) {
              if (sensor.sensorId === "location") {
                // Location is special, value is a string from `sensorApiData.value`
                newData.location = String(sensorApiData.value);
              } else {
                // All other sensors are numbers
                const numericValue =
                  typeof sensorApiData.value === "number"
                    ? sensorApiData.value
                    : parseFloat(String(sensorApiData.value));
                newData[sensor.sensorId] = `${sensor.formatting(
                  numericValue
                )} ${sensorApiData.unit || sensor.unit || ""}`.trim();
              }
            }
          }
          return newData;
        });

        setLastUpdated((prevLastUpdated) => {
          const newLastUpdated = { ...prevLastUpdated };
          for (const sensor of sensorConfig) {
            const sensorApiData = latest[sensor.sensorId];
            if (sensorApiData) {
              newLastUpdated[sensor.sensorId] = new Date(sensorApiData.ts);
            }
          }
          return newLastUpdated;
        });
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        // Keep previous data on error
      }
    };

    fetchData();
    // Refresh data at regular intervals
    const interval = setInterval(fetchData, SENSOR_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { data, lastUpdated };
}

