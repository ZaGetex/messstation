"use client";

import { useState, useEffect } from "react";
import { Download, MapPin, Thermometer, Droplets, Gauge } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import DownloadButton from "../components/DownloadButton";

// Utility function to get time difference and status
const getTimeStatus = (timestamp: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - timestamp.getTime()) / (1000 * 60)
  );

  if (diffInMinutes <= 1) {
    return { color: "bg-green-500", text: "Now" };
  } else if (diffInMinutes <= 5) {
    return { color: "bg-orange-500", text: `${diffInMinutes} Min. ago` };
  } else if (diffInMinutes <= 60) {
    return { color: "bg-red-500", text: `${diffInMinutes} Min. ago` };
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return { color: "bg-red-600", text: `${diffInHours}h ago` };
  }
};

const LocationMap = dynamic(() => import("../components/LocationMap"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState({
    location: "N/A",
    temperature: "N/A",
    humidity: "N/A",
    pressure: "N/A",
    lastUpdated: {
      location: new Date(Date.now()),
      temperature: new Date(Date.now()),
      humidity: new Date(Date.now()),
      pressure: new Date(Date.now()),
    },
  });

  // Fetch latest sensor data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/latest");
        if (!response.ok) throw new Error("Failed to fetch data");
        const latest = await response.json();

        setData((prev) => ({
          location: latest.location ? latest.location.value : prev.location,
          temperature: latest.temperature
            ? `${latest.temperature.value.toFixed(1)} ${
                latest.temperature.unit || ""
              }`
            : prev.temperature,
          humidity: latest.humidity
            ? `${latest.humidity.value.toFixed(0)} ${
                latest.humidity.unit || ""
              }`
            : prev.humidity,
          pressure: latest.pressure
            ? `${latest.pressure.value.toFixed(0)} ${
                latest.pressure.unit || ""
              }`
            : prev.pressure,
          lastUpdated: {
            location: latest.location
              ? new Date(latest.location.ts)
              : prev.lastUpdated.location,
            temperature: latest.temperature
              ? new Date(latest.temperature.ts)
              : prev.lastUpdated.temperature,
            humidity: latest.humidity
              ? new Date(latest.humidity.ts)
              : prev.lastUpdated.humidity,
            pressure: latest.pressure
              ? new Date(latest.pressure.ts)
              : prev.lastUpdated.pressure,
          },
        }));
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        // Keep previous data on error
      }
    };

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardData = [
    {
      title: "Location",
      value: data.location,
      icon: MapPin,
      iconColor: "text-primary-400",
      bgColor: "bg-primary-400/10",
      shadowColor: "shadow-primary-400/20",
      borderColor: "hover:border-primary-400/50",
      hoverTextColor: "group-hover:text-primary-400",
      lastUpdated: data.lastUpdated.location,
    },
    {
      title: "Temperatur",
      value: data.temperature,
      icon: Thermometer,
      iconColor: "text-accent-dark",
      bgColor: "bg-accent-dark/10",
      shadowColor: "shadow-accent-dark/20",
      borderColor: "hover:border-accent-dark/50",
      hoverTextColor: "group-hover:text-accent-dark",
      lastUpdated: data.lastUpdated.temperature,
    },
    {
      title: "Luftfeuchtigkeit",
      value: data.humidity,
      icon: Droplets,
      iconColor: "text-primary-200",
      bgColor: "bg-primary-200/10",
      shadowColor: "shadow-primary-200/20",
      borderColor: "hover:border-primary-200/50",
      hoverTextColor: "group-hover:text-primary-200",
      lastUpdated: data.lastUpdated.humidity,
    },
    {
      title: "Luftdruck",
      value: data.pressure,
      icon: Gauge,
      iconColor: "text-primary-300",
      bgColor: "bg-primary-300/10",
      shadowColor: "shadow-primary-300/20",
      borderColor: "hover:border-primary-300/50",
      hoverTextColor: "group-hover:text-primary-300",
      lastUpdated: data.lastUpdated.pressure,
    },
  ];

  return (
    <>
      <header className="px-4 mt-16 mb-8 text-center sm:mt-24 sm:mb-12">
        <h1 className="text-3xl font-black text-transparent sm:text-5xl md:text-7xl bg-clip-text bg-gradient-to-r from-primary-400 to-accent-medium dark:from-accent-light dark:to-primary-400">
          Barkasse Messstation Dashboard
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-primary-600 dark:text-primary-50">
          Live-Messwerte deiner Station auf einen Blick
        </p>
      </header>

      <section className="grid w-full grid-cols-1 gap-4 px-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 max-w-7xl sm:px-0">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          const timeStatus = getTimeStatus(card.lastUpdated);
          return (
            <div
              key={index}
              className={`group bg-background-light/40 dark:bg-primary-600/40 backdrop-blur-lg border border-primary-50/20 dark:border-primary-200/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${card.shadowColor} ${card.borderColor}`}
            >
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-300 ${card.bgColor}`}
              >
                <Icon className={`${card.iconColor} w-6 h-6 sm:w-8 sm:h-8`} />
              </div>
              <h2 className="text-sm font-medium sm:text-base text-primary-600 dark:text-primary-50">
                {card.title}
              </h2>
              <p
                className={`text-2xl sm:text-4xl font-bold text-text-primary dark:text-text-light mt-2 transition-colors duration-300 ${card.hoverTextColor}`}
              >
                {card.value}
              </p>

              {/* Update indicator */}
              <div className="flex items-center gap-2 mt-2 text-xs sm:mt-3 text-primary-500 dark:text-primary-300">
                <div
                  className={`w-2 h-2 rounded-full ${timeStatus.color}`}
                ></div>
                <span>{timeStatus.text}</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="w-full px-4 mt-6 max-w-7xl sm:mt-8 sm:px-0">
        <h3 className="mb-3 text-xs font-semibold tracking-wide uppercase sm:text-sm text-primary-600 dark:text-primary-50">
          Karte | 52° 31' 12.0288'' N
        </h3>{" "}
        {/*TODO: Dynmaische Koordinaten aus der Datenbank*/}
        <LocationMap query={data.location} height={280} />
      </section>

      <section className="flex flex-col gap-4 px-4 mt-12 mb-8 sm:gap-6 sm:mt-16 sm:flex-row sm:px-0">
        <DownloadButton />
        <Link
          href="/history"
          className="px-6 py-3 font-semibold text-center transition-transform transform border shadow-lg sm:px-8 sm:py-4 bg-background-light/60 dark:bg-primary-600/60 backdrop-blur-sm text-text-primary dark:text-text-light rounded-xl sm:rounded-2xl border-primary-50/30 dark:border-primary-200/50 hover:scale-105 hover:-translate-y-1 hover:bg-background-light/80 dark:hover:bg-primary-500/80 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
        >
          Verlauf ansehen
        </Link>
      </section>

      {/* NEU: Verweis auf das übergeordnete Projekt */}
      <p className="px-4 mt-3 text-xs text-center sm:text-sm text-primary-600/80 dark:text-primary-50/80">
        Ein Projekt des{" "}
        <a
          href="https://libertalia-kollektiv.eu/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline transition-colors text-primary-400 dark:text-accent-light hover:text-accent-medium dark:hover:text-primary-400"
        >
          Libertalia Kollektivs
        </a>
        .
      </p>
    </>
  );
}
