"use client";

import { useState } from "react";
import { Download, MapPin, Thermometer, Droplets, Gauge } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("../components/LocationMap"), { ssr: false });

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
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      shadowColor: "shadow-indigo-500/20",
      borderColor: "hover:border-indigo-400/50",
      hoverTextColor: "group-hover:text-indigo-600",
    },
    {
      title: "Temperatur",
      value: data.temperature,
      icon: Thermometer,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
      shadowColor: "shadow-red-500/20",
      borderColor: "hover:border-red-400/50",
      hoverTextColor: "group-hover:text-red-600",
    },
    {
      title: "Luftfeuchtigkeit",
      value: data.humidity,
      icon: Droplets,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      shadowColor: "shadow-blue-500/20",
      borderColor: "hover:border-blue-400/50",
      hoverTextColor: "group-hover:text-blue-600",
    },
    {
      title: "Luftdruck",
      value: data.pressure,
      icon: Gauge,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      shadowColor: "shadow-green-500/20",
      borderColor: "hover:border-green-400/50",
      hoverTextColor: "group-hover:text-green-600",
    },
  ];

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 sm:p-6 md:p-10">
      
      <header className="mt-8 mb-12 text-center">
        <h1 className="text-5xl font-black text-transparent md:text-7xl bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Barkasse Messstation Dashboard
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300">
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
              className={`group bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 rounded-3xl p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${card.shadowColor} ${card.borderColor}`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${card.bgColor}`}
              >
                <Icon className={`${card.iconColor} w-8 h-8`} />
              </div>
              <h2 className="text-base font-medium text-slate-600 dark:text-slate-300">
                {card.title}
              </h2>
              {/* NEU: hoverTextColor für dynamische Textfarbe bei Hover */}
              <p className={`text-4xl font-bold text-slate-900 dark:text-slate-100 mt-2 transition-colors duration-300 ${card.hoverTextColor}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Interaktive Karte unter der Location-Karte */}
      <section className="w-full max-w-7xl mt-8">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 uppercase">Karte</h3>
        <LocationMap query={data.location} height={320} />
      </section>

      <section className="flex flex-col gap-6 mt-16 mb-8 sm:flex-row">
        {/* NEU: Hover-Effekt für Buttons */}
        <button className="flex items-center gap-3 px-8 py-4 font-semibold text-white transition-transform transform shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:scale-105 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300">
          <Download className="w-5 h-5" />
          CSV Export
        </button>
        <Link href="/history" className="px-8 py-4 font-semibold transition-transform transform border shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 rounded-2xl border-white/30 dark:border-slate-700/50 hover:scale-105 hover:-translate-y-1 hover:bg-white/80 dark:hover:bg-slate-700/80 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
          Verlauf ansehen
        </Link>
      </section>
    </main>
  );
}