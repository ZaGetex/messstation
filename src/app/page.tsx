"use client";

import { useState } from "react";
import { Download, MapPin, Thermometer, Droplets, Gauge } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import DateTime from "../components/DateTime";
import Logo from "../components/Logo";

const LocationMap = dynamic(() => import("../components/LocationMap"), {
  ssr: false,
});

export default function Home() {
  const [data] = useState({
    location: "Berlin, DE",
    temperature: "21.4 °C",
    humidity: "55 %",
    pressure: "1013 hPa",
  });

  // NEU: Datenstruktur mit mehr Styling-Informationen erweitert
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
    },
  ];

  return (
    <>
      

      <header className="mt-24 mb-12 text-center">
        <h1 className="text-5xl font-black text-transparent md:text-7xl bg-clip-text bg-gradient-to-r from-primary-400 to-accent-medium dark:from-accent-light dark:to-primary-400">
          Barkasse Messstation Dashboard
        </h1>
        <p className="mt-4 text-lg md:text-xl text-primary-600 dark:text-primary-50">
          Live-Messwerte deiner Station auf einen Blick
        </p>
      </header>
      <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 max-w-7xl">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          return (
            // NEU: Klassen für farbigen Schatten, Hover-Effekte und "group" hinzugefügt
            <div
              key={index}
              className={`group bg-background-light/40 dark:bg-primary-600/40 backdrop-blur-lg border border-primary-50/20 dark:border-primary-200/30 rounded-3xl p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${card.shadowColor} ${card.borderColor}`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${card.bgColor}`}
              >
                <Icon className={`${card.iconColor} w-8 h-8`} />
              </div>
              <h2 className="text-base font-medium text-primary-600 dark:text-primary-50">
                {card.title}
              </h2>
              {/* NEU: hoverTextColor für dynamische Textfarbe bei Hover */}
              <p
                className={`text-4xl font-bold text-text-primary dark:text-text-light mt-2 transition-colors duration-300 ${card.hoverTextColor}`}
              >
                {card.value}
              </p>
            </div>
          );
        })}
      </section>
      {/* Interaktive Karte unter der Location-Karte */}
      <section className="w-full max-w-7xl mt-8">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-primary-600 dark:text-primary-50 uppercase">
          Karte | 52° 31' 12.0288'' N
        </h3>{" "}
        {/*TODO: Dynmaische Koordinaten aus der Datenbank*/}
        <LocationMap query={data.location} height={320} />
      </section>
      <section className="flex flex-col gap-6 mt-16 mb-8 sm:flex-row">
        {/* NEU: Hover-Effekt für Buttons */}
        <button className="flex items-center gap-3 px-8 py-4 font-semibold text-white transition-transform transform shadow-lg bg-gradient-to-r from-primary-400 to-accent-medium rounded-2xl hover:scale-105 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-400/50">
          <Download className="w-5 h-5" />
          CSV Export
        </button>
        <Link
          href="/history"
          className="px-8 py-4 font-semibold transition-transform transform border shadow-lg bg-background-light/60 dark:bg-primary-600/60 backdrop-blur-sm text-text-primary dark:text-text-light rounded-2xl border-primary-50/30 dark:border-primary-200/50 hover:scale-105 hover:-translate-y-1 hover:bg-background-light/80 dark:hover:bg-primary-500/80 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
        >
          Verlauf ansehen
        </Link>
      </section>
    </>
  );
}
