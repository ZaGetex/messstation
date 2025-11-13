// src/lib/sensorConfig.ts

import {
    Thermometer,
    Droplets,
    Gauge,
    MapPin,
    Wind,
    LucideIcon,
  } from "lucide-react";
  
  // Define the shape of a single sensor's configuration
  export interface SensorConfig {
    // --- Universal ---
    sensorId: string; // The ID used in the database (e.g., "temperature")
    title: string; // The human-readable title (e.g., "Temperatur")
    unit?: string; // The unit (e.g., "°C")
    icon: LucideIcon; // The icon component from lucide-react
  
    // --- Dashboard Card ---
    // A function to format the value for display
    formatting: (value: number) => string;
    iconColor: string; // e.g., "text-accent-dark"
    bgColor: string; // e.g., "bg-accent-dark/10"
    shadowColor: string; // e.g., "shadow-accent-dark/20"
    borderColor: string; // e.g., "hover:border-accent-dark/50"
    hoverTextColor: string; // e.g., "group-hover:text-accent-dark"
  
    // --- History & Download ---
    showInHistory: boolean; // Show this sensor on the history chart
    showInDownload: boolean; // Make this sensor an option in the CSV download
    description: string; // Description for the download modal
  
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
      unit: "°C", // Fallback Default Unit if no unit is provided
      icon: Thermometer,
      formatting: (value) => value.toFixed(1),
      iconColor: "text-accent-dark",
      bgColor: "bg-accent-dark/10",
      shadowColor: "shadow-accent-dark/20",
      borderColor: "hover:border-accent-dark/50",
      hoverTextColor: "group-hover:text-accent-dark",
      showInHistory: true,
      showInDownload: true,
      description: "Temperaturdaten in °C",
      chartColor: "#e74c3c", // Red
      chartYAxis: "y",
    },
    {
      sensorId: "humidity",
      title: "Luftfeuchtigkeit",
      unit: "%",
      icon: Droplets,
      formatting: (value) => value.toFixed(0),
      iconColor: "text-primary-200",
      bgColor: "bg-primary-200/10",
      shadowColor: "shadow-primary-200/20",
      borderColor: "hover:border-primary-200/50",
      hoverTextColor: "group-hover:text-primary-200",
      showInHistory: true,
      showInDownload: true,
      description: "Feuchtigkeitsdaten in %",
      chartColor: "#3498db", // Blue
      chartYAxis: "y",
    },
    {
      sensorId: "air_pressure", // Matches the ID in your /api/latest route
      title: "Luftdruck",
      unit: "hPa",
      icon: Gauge,
      formatting: (value) => value.toFixed(0),
      iconColor: "text-primary-300",
      bgColor: "bg-primary-300/10",
      shadowColor: "shadow-primary-300/20",
      borderColor: "hover:border-primary-300/50",
      hoverTextColor: "group-hover:text-primary-300",
      showInHistory: true,
      showInDownload: true,
      description: "Druckdaten in hPa",
      chartColor: "#27ae60", // Green
      chartYAxis: "y2", // Use the right-hand Y-axis
    },
    {
      sensorId: "location",
      title: "Location",
      unit: "", // Location value is a string, not a number
      icon: MapPin,
      // Special formatting for location (which is a string)
      // The API returns the location string in the `value` field
      formatting: (value) => String(value),
      iconColor: "text-primary-400",
      bgColor: "bg-primary-400/10",
      shadowColor: "shadow-primary-400/20",
      borderColor: "hover:border-primary-400/50",
      hoverTextColor: "group-hover:text-primary-400",
      showInHistory: false, // Don't show location on the history chart
      showInDownload: true,
      description: "GPS-Koordinaten und Adresse",
      chartColor: "#9b59b6", // Purple (not used)
    },
    // --- ADD NEW SENSORS HERE ---
    // Example for a new "Wind" sensor:
    /*
    {
      sensorId: "wind_speed",
      title: "Windstärke",
      unit: "km/h",
      icon: Wind,
      formatting: (value) => value.toFixed(1),
      iconColor: "text-gray-500",
      bgColor: "bg-gray-500/10",
      shadowColor: "shadow-gray-500/20",
      borderColor: "hover:border-gray-500/50",
      hoverTextColor: "group-hover:text-gray-600",
      showInHistory: true,
      showInDownload: true,
      description: "Winddaten in km/h",
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