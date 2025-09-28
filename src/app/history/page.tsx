"use client";

import React, { useMemo, useState } from "react";
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

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale
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
  const { labels, temperature, humidity, pressure } = useFakeData(range);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Temperatur (°C)",
          data: temperature,
          borderColor: "#192f61",
          backgroundColor: "rgba(25, 47, 97, 0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 0,
        },
        {
          label: "Luftfeuchtigkeit (%)",
          data: humidity,
          borderColor: "#123a98",
          backgroundColor: "rgba(18, 58, 152, 0.12)",
          tension: 0.3,
          fill: true,
          pointRadius: 0,
        },
        {
          label: "Luftdruck (hPa)",
          data: pressure,
          borderColor: "#485c8c",
          backgroundColor: "rgba(72, 92, 140, 0.12)",
          tension: 0.25,
          fill: true,
          pointRadius: 0,
          yAxisID: "y2",
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
        legend: { position: "bottom" as const, labels: { color: "#011541" } },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          ticks: { color: "#042061" },
          grid: { color: "rgba(165, 186, 215, 0.2)" },
        },
        y: {
          position: "left" as const,
          ticks: { color: "#042061" },
          grid: { color: "rgba(165, 186, 215, 0.2)" },
        },
        y2: {
          position: "right" as const,
          ticks: { color: "#042061" },
          grid: { drawOnChartArea: false },
        },
      },
    }),
    []
  );

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-br from-background-light via-accent-light to-primary-50 dark:from-background-dark dark:via-primary-600 dark:to-primary-700 sm:p-6 md:p-10">
      <header className="mt-24 mb-10 flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Link>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-light">
            Verlauf
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                range === r.key
                  ? "bg-primary-400 text-white border-primary-400"
                  : "bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      <section className="w-full max-w-7xl grid grid-cols-1 gap-6">
        <div
          className="bg-background-light/60 dark:bg-primary-600/60 backdrop-blur-md border border-primary-50/30 dark:border-primary-200/50 rounded-3xl p-6 shadow-lg"
          style={{ height: 420 }}
        >
          <Line data={data} options={options} />
        </div>
      </section>
    </main>
  );
}
