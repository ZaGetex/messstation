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
} from "chart.js";
import { Line } from "react-chartjs-2";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DateTime from "../../components/DateTime";
import DownloadButton from "../../components/DownloadButton";
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

const ranges: {
  key: RangeKey;
  label: string;
  points: number;
  minutesStep: number;
}[] = [
  { key: "1h", label: "Letzte Stunde", points: 60, minutesStep: 1 },
  { key: "5h", label: "Letzte 5h", points: 60, minutesStep: 5 },
  { key: "1d", label: "Letzter Tag", points: 96, minutesStep: 15 },
  { key: "1w", label: "Letzte Woche", points: 84, minutesStep: 120 },
];

function generateFakeSeries(points: number, base: number, amplitude: number) {
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * amplitude * 0.2;
    const wave = Math.sin((i / points) * Math.PI * 4) * amplitude;
    data.push(base + wave + noise);
  }
  return data;
}

function useFakeData(range: RangeKey) {
  const meta = ranges.find((r) => r.key === range)!;
  const now = new Date();
  const labels: string[] = [];
  for (let i = meta.points - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * meta.minutesStep * 60_000);
    labels.push(
      `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  }

  const temperature = generateFakeSeries(meta.points, 21.5, 3.5);
  const humidity = generateFakeSeries(meta.points, 55, 10);
  const pressure = generateFakeSeries(meta.points, 1013, 4);

  return { labels, temperature, humidity, pressure };
}

export default function HistoryPage() {
  const [range, setRange] = useState<RangeKey>("1h");
  const [isMobile, setIsMobile] = useState(false);
  const { labels, temperature, humidity, pressure } = useFakeData(range);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Temperatur (°C)",
          data: temperature,
          borderColor: "#e74c3c",
          backgroundColor: "rgba(231, 76, 60, 0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 0,
        },
        {
          label: "Temperatur Trend",
          data: temperature,
          borderColor: "#e74c3c",
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          showLine: true,
          trendlineLinear: {
            colorMin: "#e74c3c",
            colorMax: "#e74c3c",
            lineStyle: "dashed",
            width: 2,
          },
        },
        {
          label: "Luftfeuchtigkeit (%)",
          data: humidity,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 0,
        },
        {
          label: "Luftfeuchtigkeit Trend",
          data: humidity,
          borderColor: "#3498db",
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          showLine: true,
          trendlineLinear: {
            colorMin: "#3498db",
            colorMax: "#3498db",
            lineStyle: "dashed",
            width: 2,
          },
        },
        {
          label: "Luftdruck (hPa)",
          data: pressure,
          borderColor: "#27ae60",
          backgroundColor: "rgba(39, 174, 96, 0.15)",
          tension: 0.25,
          fill: true,
          pointRadius: 0,
          yAxisID: "y2",
        },
        {
          label: "Luftdruck Trend",
          data: pressure,
          borderColor: "#27ae60",
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          showLine: true,
          yAxisID: "y2",
          trendlineLinear: {
            colorMin: "#27ae60",
            colorMax: "#27ae60",
            lineStyle: "dashed",
            width: 2,
          },
        },
      ],
    }),
    [labels, temperature, humidity, pressure]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: "#011541",
            font: {
              size: isMobile ? 8 : 12,
            },
            padding: isMobile ? 4 : 12,
            boxWidth: isMobile ? 8 : 16,
          },
        },
        tooltip: {
          enabled: true,
          titleFont: {
            size: isMobile ? 10 : 13,
          },
          bodyFont: {
            size: isMobile ? 9 : 12,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#042061",
            font: {
              size: isMobile ? 8 : 11,
            },
          },
          grid: { color: "rgba(165, 186, 215, 0.2)" },
        },
        y: {
          position: "left" as const,
          ticks: {
            color: "#042061",
            font: {
              size: isMobile ? 8 : 11,
            },
          },
          grid: { color: "rgba(165, 186, 215, 0.2)" },
        },
        y2: {
          position: "right" as const,
          ticks: {
            color: "#042061",
            font: {
              size: isMobile ? 8 : 11,
            },
          },
          grid: { drawOnChartArea: false },
        },
      },
    }),
    [isMobile]
  );

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-br from-background-light via-accent-light to-primary-50 dark:from-background-dark dark:via-primary-600 dark:to-primary-700 sm:p-6 md:p-10">
      <header className="mt-16 sm:mt-24 mb-6 sm:mb-10 flex flex-col sm:flex-row w-full max-w-7xl items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Zurück</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-light">
            Verlauf
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
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

      <section className="w-full max-w-7xl grid grid-cols-1 gap-6 px-4 sm:px-0">
        <div
          className="bg-background-light/60 dark:bg-primary-600/60 backdrop-blur-md border border-primary-50/30 dark:border-primary-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
          style={{ height: isMobile ? 400 : 420 }}
        >
          <Line data={data} options={options} />
        </div>
      </section>
    </main>
  );
}
