/**
 * Custom hook for fetching and managing sensor data
 */

import { useState, useEffect } from "react";
import { SensorDataState, SensorLastUpdatedState } from "@/types/sensor";
import { LatestSensorDataResponse } from "@/types/api";
import { sensorConfig } from "@/lib/config/sensors";
import { SENSOR_REFRESH_INTERVAL } from "@/lib/constants/timeRanges";
import { reverseGeocode } from "@/lib/utils/geocode";

/** Latest GNSS position from cluster gnss (lon, lat in deg) or null */
export type GnssPosition = { lat: number; lng: number } | null;

/**
 * Hook that fetches and manages the latest sensor data
 * Automatically refreshes data at regular intervals
 *
 * @returns Object containing sensor data state, last updated timestamps, and optional GNSS position
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

  const [gnssPosition, setGnssPosition] = useState<GnssPosition>(null);
  const [gnssPlaceName, setGnssPlaceName] = useState<string | null>(null);

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

        // GNSS position from cluster gnss (lon, lat in deg)
        const latData = latest.gnss_lat;
        const lonData = latest.gnss_lon;
        if (
          latData &&
          lonData &&
          typeof latData.value === "number" &&
          typeof lonData.value === "number"
        ) {
          setGnssPosition({
            lat: latData.value,
            lng: lonData.value,
          });
        } else {
          setGnssPosition(null);
        }
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

  // Reverse-geocode GNSS position to Ort (place name) for Location Card and map
  useEffect(() => {
    if (!gnssPosition) {
      setGnssPlaceName(null);
      return;
    }
    let cancelled = false;
    reverseGeocode(gnssPosition.lat, gnssPosition.lng).then((name) => {
      if (!cancelled && name) setGnssPlaceName(name);
      if (!cancelled && !name) setGnssPlaceName(null);
    });
    return () => {
      cancelled = true;
    };
  }, [gnssPosition?.lat, gnssPosition?.lng]);

  return { data, lastUpdated, gnssPosition, gnssPlaceName };
}

