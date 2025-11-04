"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import "chartjs-adapter-date-fns";
import { de } from "date-fns/locale";
import { Line } from "react-chartjs-2";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import DownloadButton from "../../components/DownloadButton";
import { useTheme } from "../../contexts/ThemeContext";
// @ts-ignore
import trendline from "chartjs-plugin-trendline";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  trendline
);

type RangeKey = "1h" | "5h" | "1d" | "1w";

const ranges: { key: RangeKey; label: string }[] = [
  { key: "1h", label: "Letzte Stunde" },
  { key: "5h", label: "Letzte 5h" },
  { key: "1d", label: "Letzter Tag" },
  { key: "1w", label: "Letzte Woche" },
];

type SensorDataRecord = {
  ts: string;
  sensor: string;
  value: number;
  unit: string | null;
};

// Default colors for auto-generated sensors
const COLORS = [
  "#e74c3c", // red
  "#3498db", // blue
  "#27ae60", // green
  "#f1c40f", // yellow
  "#9b59b6", // purple
  "#1abc9c", // teal
  "#e67e22", // orange
];

/** Processes API data dynamically into Chart.js format */
function processDataForChart(apiData: SensorDataRecord[]): ChartData<"line"> {
  const grouped: Record<string, { x: Date; y: number; unit: string | null }[]> =
    {};

  for (const { sensor, ts, value, unit } of apiData) {
    if (!grouped[sensor]) grouped[sensor] = [];
    grouped[sensor].push({ x: new Date(ts), y: value, unit });
  }

  const datasets: any[] = [];
  let colorIndex = 0;

  for (const [sensor, data] of Object.entries(grouped)) {
    const color = COLORS[colorIndex % COLORS.length];
    const unit = data[0]?.unit ?? "";

    // Main line
    datasets.push({
      label: `${sensor} (${unit})`,
      data,
      borderColor: color,
      backgroundColor: `${color}33`,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: color,
      fill: false,
      yAxisID: "y",
      order: 1,
    });

    // Optional trendline
    datasets.push({
      label: `${sensor} Trend`,
      data,
      borderColor: color,
      borderDash: [6, 4],
      borderWidth: 1.5,
      pointRadius: 0,
      showLine: true,
      yAxisID: "y",
      order: 2,
      // @ts-ignore
      trendlineLinear: {
        colorMin: color,
        colorMax: color,
        lineStyle: "dashed",
        width: 1.5,
      },
    });

    colorIndex++;
  }

  return { datasets };
}

export default function HistoryPage() {
  const [range, setRange] = useState<RangeKey>("1h");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const { theme } = useTheme();

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/history-chart?range=${range}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        setChartData(processDataForChart(json.data));
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setChartData({ datasets: [] });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [range]);

  const chartOptions = useMemo((): ChartOptions<"line"> => {
    const gridColor =
      theme === "dark"
        ? "rgba(120, 120, 120, 0.3)"
        : "rgba(180, 180, 180, 0.2)";
    const tickColor = theme === "dark" ? "#e5e7eb" : "#111827";
    const tickSize = isMobile ? 8 : 11;

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      animation: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: tickColor,
            font: { size: isMobile ? 9 : 12 },
            padding: 10,
            filter: (item) => !item.text.includes("Trend"),
          },
        },
        tooltip: {
          enabled: true,
          intersect: false,
          mode: "index",
          backgroundColor:
            theme === "dark" ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.9)",
          titleColor: tickColor,
          bodyColor: tickColor,
          borderColor: gridColor,
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              // ctx.raw can be a number or an object like {x, y, unit}
              const raw = ctx.raw as unknown;
              let unit = "";
              if (typeof raw === "object" && raw !== null && "unit" in raw) {
                unit = (raw as any).unit ?? "";
              }

              // Remove the "(unit)" suffix from dataset label so tooltip shows clean sensor name
              const labelBase = ctx.dataset.label
                ? ctx.dataset.label.replace(/\s*\(.+\)$/, "")
                : "value";

              // Ensure parsed.y exists (should for line charts)
              const value =
                typeof ctx.parsed === "object"
                  ? (ctx.parsed as any).y
                  : ctx.parsed;

              return `${labelBase}: ${value}${unit}`;
            },
          },
          titleFont: { size: isMobile ? 10 : 13 },
          bodyFont: { size: isMobile ? 9 : 12 },
          filter: (item) => !item.dataset.label?.includes("Trend"),
        },
      },
      scales: {
        x: {
          type: "time",
          adapters: { date: { locale: de } },
          time: {
            tooltipFormat: "dd.MM.yyyy HH:mm",
            displayFormats: {
              minute: "HH:mm",
              hour: "HH:mm",
              day: "dd.MM.",
              week: "dd.MM.",
            },
          },
          ticks: { color: tickColor, font: { size: tickSize } },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: tickColor, font: { size: tickSize } },
          grid: { color: gridColor },
        },
      },
    };
  }, [isMobile, theme]);

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-1 bg-gradient-to-br from-background-light via-accent-light to-primary-50 dark:from-background-dark dark:via-primary-600 dark:to-primary-700 sm:p-6 md:p-10">
      <header className="flex flex-col items-start justify-between w-full gap-4 mt-16 mb-6 sm:mt-24 sm:mb-10 sm:flex-row max-w-7xl sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 transition-colors border sm:px-4 rounded-xl bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Zurück</span>
          </Link>
          <h1 className="text-xl font-bold sm:text-2xl text-text-primary dark:text-text-light">
            Verlauf
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
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-3 text-lg">Lade Daten...</span>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </section>
    </main>
  );
}
