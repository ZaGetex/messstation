// src/lib/sensorConfig.ts

import {
    Thermometer,
    Droplets,
    Gauge,
    MapPin,
    Wind,
    Waves,
    Activity,
    Cloud,
    LucideIcon,
  } from "lucide-react";
  
  // Define the shape of a single sensor's configuration
  export interface SensorConfig {
    // --- Universal ---
    sensorId: string; // The ID used in the database (e.g., "temperature")
    title: string; // The German title (e.g., "Temperatur")
    titleEn: string; // The English title (e.g., "Temperature")
    unit?: string; // The unit (e.g., "°C")
    icon: LucideIcon; // The icon component from lucide-react
  
    // --- Dashboard Card ---
    // A function to format the value for display
    formatting: (value: number) => string;
    iconColor: string; // e.g., "text-accent-dark"
    // bgColor removed - will be handled by page.tsx
    shadowColor: string; // e.g., "shadow-accent-dark/20"
    borderColor: string; // e.g., "hover:border-accent-dark/50"
    hoverTextColor: string; // e.g., "group-hover:text-accent-dark"
  
    // --- History & Download ---
    showInHistory: boolean; // Show this sensor on the history chart
    showInDownload: boolean; // Make this sensor an option in the CSV download
    description: string; // German description for the download modal
    descriptionEn: string; // English description for the download modal
  
    // --- History Chart Specifics ---
    chartColor: string; // Hex color for the chart line (e.g., "#e74c3c")
    chartYAxis?: "y" | "y2"; // Which Y-axis to use (default 'y')
  }
  
  // --- MASTER SENSOR CONFIGURATION ---
  // This is the only array you need to edit to add or remove sensors.
  export const sensorConfig: SensorConfig[] = [
    {
      sensorId: "temperature",
      title: "Temperatur",
      titleEn: "Temperature",
      unit: "°C", // Fallback Default Unit if no unit is provided
      icon: Thermometer,
      formatting: (value) => value.toFixed(1),
      iconColor: "text-accent-dark",
      shadowColor: "shadow-accent-dark/20",
      borderColor: "hover:border-accent-dark/50",
      hoverTextColor: "group-hover:text-accent-dark",
      showInHistory: true,
      showInDownload: true,
      description: "Temperaturdaten in °C",
      descriptionEn: "Temperature data in °C",
      chartColor: "#e74c3c", // Red
      chartYAxis: "y",
    },
    {
      sensorId: "humidity",
      title: "Luftfeuchtigkeit",
      titleEn: "Humidity",
      unit: "%",
      icon: Droplets,
      formatting: (value) => value.toFixed(0),
      iconColor: "text-primary-200",
      shadowColor: "shadow-primary-200/20",
      borderColor: "hover:border-primary-200/50",
      hoverTextColor: "group-hover:text-primary-200",
      showInHistory: true,
      showInDownload: true,
      description: "Feuchtigkeitsdaten in %",
      descriptionEn: "Humidity data in %",
      chartColor: "#3498db", // Blue
      chartYAxis: "y",
    },
    {
      sensorId: "air_pressure", // Matches the ID in your /api/latest route
      title: "Luftdruck",
      titleEn: "Air Pressure",
      unit: "hPa",
      icon: Gauge,
      formatting: (value) => value.toFixed(0),
      iconColor: "text-primary-300",
      shadowColor: "shadow-primary-300/20",
      borderColor: "hover:border-primary-300/50",
      hoverTextColor: "group-hover:text-primary-300",
      showInHistory: true,
      showInDownload: true,
      description: "Druckdaten in hPa",
      descriptionEn: "Pressure data in hPa",
      chartColor: "#27ae60", // Green
      chartYAxis: "y2", // Use the right-hand Y-axis
    },
    {
      sensorId: "location",
      title: "Location",
      titleEn: "Location",
      unit: "", // Location value is a string, not a number
      icon: MapPin,
      // Special formatting for location (which is a string)
      // The API returns the location string in the `value` field
      formatting: (value) => String(value),
      iconColor: "text-primary-400",
      shadowColor: "shadow-primary-400/20",
      borderColor: "hover:border-primary-400/50",
      hoverTextColor: "group-hover:text-primary-400",
      showInHistory: false, // Don't show location on the history chart
      showInDownload: true,
      description: "GPS-Koordinaten und Adresse",
      descriptionEn: "GPS coordinates and address",
      chartColor: "#9b59b6", // Purple (not used)
    },
    // --- ADD NEW SENSORS HERE ---
    // Multi-Sensor Card Example
    {
      sensorId: "water_temperature",
      title: "Wassertemperatur",
      titleEn: "Water Temperature",
      unit: "°C",
      icon: Waves,
      formatting: (value) => value.toFixed(1),
      iconColor: "text-blue-500",
      shadowColor: "shadow-blue-500/20",
      borderColor: "hover:border-blue-500/50",
      hoverTextColor: "group-hover:text-blue-500",
      showInHistory: true,
      showInDownload: true,
      description: "Wassertemperatur in °C",
      descriptionEn: "Water temperature in °C",
      chartColor: "#3498db", // Blue
      chartYAxis: "y",
    },
    {
      sensorId: "ph",
      title: "pH-Wert",
      titleEn: "pH Scale",
      unit: "",
      icon: Activity,
      formatting: (value) => value.toFixed(2),
      iconColor: "text-purple-500",
      shadowColor: "shadow-purple-500/20",
      borderColor: "hover:border-purple-500/50",
      hoverTextColor: "group-hover:text-purple-500",
      showInHistory: true,
      showInDownload: true,
      description: "pH-Wert",
      descriptionEn: "pH scale value",
      chartColor: "#9b59b6", // Purple
      chartYAxis: "y",
    },
    {
      sensorId: "co2",
      title: "CO₂",
      titleEn: "CO₂",
      unit: "ppm",
      icon: Cloud,
      formatting: (value) => value.toFixed(0),
      iconColor: "text-green-600",
      shadowColor: "shadow-green-600/20",
      borderColor: "hover:border-green-600/50",
      hoverTextColor: "group-hover:text-green-600",
      showInHistory: true,
      showInDownload: true,
      description: "CO₂-Wert in ppm",
      descriptionEn: "CO₂ value in ppm",
      chartColor: "#27ae60", // Green
      chartYAxis: "y2",
    },
    /* Example Wind Speed Sensor 
    {
      sensorId: "wind_speed",
      title: "Windstärke",
      titleEn: "Wind Speed",
      unit: "km/h",
      icon: Wind,
      formatting: (value) => value.toFixed(1),
      iconColor: "text-gray-500",
      shadowColor: "shadow-gray-500/20",
      borderColor: "hover:border-gray-500/50",
      hoverTextColor: "group-hover:text-gray-600",
      showInHistory: true,
      showInDownload: true,
      description: "Winddaten in km/h",
      descriptionEn: "Wind data in km/h",
      chartColor: "#f39c12", // Orange
      chartYAxis: "y",
    },
    */
  ];
  
  /**
   * A helper Map for quickly looking up sensor config by its ID.
   * This is more efficient than calling .find() repeatedly.
   */
  export const sensorConfigMap = new Map<string, SensorConfig>(
    sensorConfig.map((sensor) => [sensor.sensorId, sensor])
  );