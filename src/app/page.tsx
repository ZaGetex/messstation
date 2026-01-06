/**
 * Home page component
 * Displays the main dashboard with sensor cards and location map
 */

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import DownloadButton from "@/components/export/DownloadButton";
import SensorCard from "@/components/sensors/SensorCard";
import { sensorConfig } from "@/lib/config/sensors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/lib/config/translations";
import { useSensorData } from "@/hooks/useSensorData";
import { getTimeStatus } from "@/lib/utils/time";
import { SensorCardData } from "@/types/sensor";

// Dynamically import LocationMap to avoid SSR issues
const LocationMap = dynamic(() => import("@/components/map/LocationMap"), {
  ssr: false,
});

export default function Home() {
  const { language } = useLanguage();
  const t = useTranslations(language);

  // Fetch sensor data using custom hook
  const { data, lastUpdated } = useSensorData();

  // Define which sensors should be grouped in the multi-sensor card
  // Currently disabled, but can be enabled by uncommenting the MultiSensorCard below
  const multiSensorCardSensors = ["water_temperature", "ph", "co2"];

  // Build card data array dynamically from config and state
  // Filter out sensors that are in the multi-sensor card
  const cardData: SensorCardData[] = sensorConfig
    .filter((sensor) => !multiSensorCardSensors.includes(sensor.sensorId))
    .map((sensor) => {
      const Icon = sensor.icon;
      const timeStatus = getTimeStatus(lastUpdated[sensor.sensorId], t);

      return {
        ...sensor, // Spread all properties from config
        value: data[sensor.sensorId],
        lastUpdated: lastUpdated[sensor.sensorId],
        Icon,
        timeStatus,
      };
    });

  return (
    <>
      <header className="px-4 mt-16 mb-8 text-center sm:mt-24 sm:mb-12">
        <h1 className="text-3xl font-black text-transparent sm:text-5xl md:text-7xl bg-clip-text bg-gradient-to-r from-primary-400 to-accent-medium dark:from-accent-light dark:to-primary-400">
          {t.home.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-primary-600 dark:text-primary-50">
          {t.home.subtitle}
        </p>
      </header>

      <section className="grid w-full grid-cols-1 gap-4 px-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 max-w-7xl sm:px-0">
        {cardData.map((card) => (
          <SensorCard key={card.sensorId} card={card} />
        ))}
        {/* Multi-Sensor Card Example */}
        {/* {multiSensorCardData.length > 0 && (
          <MultiSensorCard
            title={
              language === "de"
                ? "Wassermessstation"
                : "Water Monitoring Station"
            }
            sensors={multiSensorCardData}
          />
        )} */}
      </section>

      <section className="w-full px-4 mt-6 max-w-7xl sm:mt-8 sm:px-0">
        <h3 className="mb-3 text-xs font-semibold tracking-wide uppercase sm:text-sm text-primary-600 dark:text-primary-50">
          {t.home.mapTitle}
        </h3>
        {/* TODO: Dynamic coordinates from database */}
        <LocationMap query={data.location} height={280} />
      </section>

      <section className="flex flex-col gap-4 px-4 mt-12 mb-8 sm:gap-6 sm:mt-16 sm:flex-row sm:px-0">
        <DownloadButton />
        <Link
          href="/history"
          className="px-6 py-3 font-semibold text-center transition-transform transform border shadow-lg sm:px-8 sm:py-4 bg-background-light/60 dark:bg-primary-600/60 backdrop-blur-sm text-text-primary dark:text-text-light rounded-xl sm:rounded-2xl border-primary-50/30 dark:border-primary-200/50 hover:scale-105 hover:-translate-y-1 hover:bg-background-light/80 dark:hover:bg-primary-500/80 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
        >
          {t.home.viewHistory}
        </Link>
      </section>

      {/* Reference to the parent project */}
      <p className="px-4 mt-3 text-xs text-center sm:text-sm text-primary-600/80 dark:text-primary-50/80 sm:mb-0 mb-3">
        {t.home.projectText}{" "}
        <a
          href="https://libertalia-kollektiv.eu/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline transition-colors text-primary-400 dark:text-accent-light hover:text-accent-medium dark:hover:text-primary-400"
        >
          {t.home.projectLink}
        </a>
        .
      </p>
    </>
  );
}
