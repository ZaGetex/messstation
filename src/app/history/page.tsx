// src/app/history/page.tsx

"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import DownloadButton from "../../components/DownloadButton";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslations } from "@/lib/translations";
import { sensorConfig, SensorConfig } from "@/lib/sensorConfig"; // Import the new config
// @ts-ignore - chartjs-plugin-trendline doesn't have TypeScript definitions
import trendline from "chartjs-plugin-trendline";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  trendline
);

type RangeKey = "1h" | "5h" | "1d" | "1w";

// Sensor data type from the API
type SensorData = {
  ts: string; // ISO date string
  sensor: string;
  value: number;
  unit: string;
};

// Get the sensors that should be displayed on the chart
const chartSensors = sensorConfig.filter((s) => s.showInHistory);
// Check if any sensor needs the y2 axis
const useY2Axis = chartSensors.some((s) => s.chartYAxis === "y2");

// Ranges will be generated dynamically based on language

/**
 * Dynamically processes the raw sensor data array from the API.
 * @param data Raw array of SensorData objects.
 * @param sensorsToProcess The config array of sensors to include.
 * @returns An object with arrays for labels and a dataset object.
 */
function processChartData(
  data: SensorData[],
  sensorsToProcess: SensorConfig[]
) {
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

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function HistoryPage() {
  const [range, setRange] = useState<RangeKey>("1h");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: Record<string, (number | null)[]>;
  }>({ labels: [], datasets: {} });
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const ranges: {
    key: RangeKey;
    label: string;
  }[] = [
    { key: "1h", label: t.history.ranges["1h"] },
    { key: "5h", label: t.history.ranges["5h"] },
    { key: "1d", label: t.history.ranges["1d"] },
    { key: "1w", label: t.history.ranges["1w"] },
  ];

  // Fetch data from the API when the 'range' state changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/history-chart?range=${range}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const apiResponse: { data: SensorData[] } = await response.json();
        // Process data only for the sensors we want to chart
        const processedData = processChartData(apiResponse.data, chartSensors);
        setChartData(processedData);
      } catch (error) {
        console.error(error);
        setChartData({ labels: [], datasets: {} });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- DYNAMIC CHART DATASET ---
  // Build Chart.js datasets dynamically from config and fetched data
  const data = useMemo(
    () => ({
      labels: chartData.labels,
      datasets: chartSensors
        .flatMap((sensor) => [
          // The main data line
          {
            label: `${t.sensors[sensor.sensorId]?.title || sensor.title} (${sensor.unit || ""})`,
            data: chartData.datasets[sensor.sensorId] || [],
            borderColor: sensor.chartColor,
            backgroundColor: hexToRgba(sensor.chartColor, 0.15),
            tension: 0.3,
            fill: true,
            pointRadius: 0,
            yAxisID: sensor.chartYAxis || "y",
          },
          // The trendline
          {
            label: `${t.sensors[sensor.sensorId]?.title || sensor.title} ${t.history.trend}`,
            data: chartData.datasets[sensor.sensorId] || [],
            borderColor: sensor.chartColor,
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
            yAxisID: sensor.chartYAxis || "y",
            trendlineLinear: {
              colorMin: sensor.chartColor,
              colorMax: sensor.chartColor,
              lineStyle: "dashed",
              width: 2,
            },
          },
        ])
        .filter((d) => d.data.length > 0), // Filter out datasets with no data
    }),
    [chartData] // Re-calculate when chartData changes
  );
  // --- END DYNAMIC CHART DATASET ---

  // --- DYNAMIC CHART OPTIONS ---
  // Dynamically create options, including the y2 axis if needed
  const options = useMemo((): ChartOptions<"line"> => {
    const scales: ChartOptions<"line">["scales"] = {
      x: {
        ticks: {
          color: theme === "dark" ? "#d1d5db" : "#042061",
          font: { size: isMobile ? 8 : 11 },
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(75, 85, 99, 0.3)"
              : "rgba(165, 186, 215, 0.2)",
        },
      },
      y: {
        position: "left" as const,
        ticks: {
          color: theme === "dark" ? "#d1d5db" : "#042061",
          font: { size: isMobile ? 8 : 11 },
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(75, 85, 99, 0.3)"
              : "rgba(165, 186, 215, 0.2)",
        },
      },
    };

    // If any sensor uses y2, add it to the scales
    if (useY2Axis) {
      scales.y2 = {
        position: "right" as const,
        ticks: {
          color: theme === "dark" ? "#d1d5db" : "#042061",
          font: { size: isMobile ? 8 : 11 },
        },
        grid: { drawOnChartArea: false },
      };
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" as const, intersect: false },
      spanGaps: true,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: theme === "dark" ? "#e5e7eb" : "#011541",
            font: { size: isMobile ? 8 : 12 },
            padding: isMobile ? 6 : 12,
            boxWidth: isMobile ? 8 : 16,
          },
        },
        tooltip: {
          enabled: true,
          titleFont: { size: isMobile ? 10 : 13 },
          bodyFont: { size: isMobile ? 9 : 12 },
        },
      },
      scales, // Add the dynamically generated scales
    };
  }, [isMobile, theme]);
  // --- END DYNAMIC CHART OPTIONS ---

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-1 bg-gradient-to-br from-background-light via-accent-light to-primary-50 dark:from-background-dark dark:via-primary-600 dark:to-primary-700 sm:p-6 md:p-10">
      <header className="flex flex-col items-start justify-between w-full gap-4 mt-16 mb-6 sm:mt-24 sm:mb-10 sm:flex-row max-w-7xl sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 transition-colors border sm:px-4 rounded-xl bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.history.back}</span>
          </Link>
          <h1 className="text-xl font-bold sm:text-2xl text-text-primary dark:text-text-light">
            {t.history.title}
          </h1>
        </div>
        <div className="flex flex-col items-start w-full gap-4 sm:flex-row sm:items-center sm:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                  range === r.key
                    ? "bg-primary-400 text-white border-primary-400"
                    : "bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <DownloadButton />
        </div>
      </header>

      <section className="grid w-full grid-cols-1 gap-6 px-1 max-w-7xl sm:px-4">
        <div
          className="p-1 border shadow-lg sm:p-4 bg-background-light/60 dark:bg-primary-600/60 backdrop-blur-md border-primary-50/30 dark:border-primary-200/50 rounded-2xl sm:rounded-3xl sm:p-6"
          style={{ height: isMobile ? 400 : 420 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full text-text-primary dark:text-text-light">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">{t.history.loading}</span>
            </div>
          ) : (
            <Line data={data} options={options} />
          )}
        </div>
      </section>
    </main>
  );
}
