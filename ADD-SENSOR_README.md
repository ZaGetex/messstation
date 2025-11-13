## How to Add a New Sensor (e.g., "Wind Speed")

This guide explains how to add a new sensor to the Messstation dashboard.

The application is now highly modular. The database, data-intake API, dashboard, history page, and download modal are all driven by a **single configuration file**.

Adding a new sensor is now a simple 2-step process.

---

## Step 1: Database & Data Ingestion (No Action Needed)

**This step is already complete.**

The database schema (`prisma/schema.prisma`) and the `/api/sensor-data` `POST` route are generic. They are designed to accept _any_ sensor data you send them without any code changes.

**All you have to do is configure your sensor hub (the device sending the data) to start sending new `POST` requests for your new sensor.**

**Example JSON to send to `/api/sensor-data`:**

```json
{
  "cluster": "weather",
  "sensor": "wind_speed",
  "value": 25.5,
  "unit": "km/h",
  "ts": "2025-11-05T10:30:00Z"
}
```

The database will accept and store this data immediately.

---

## Step 2: Add the Sensor to the UI Configuration

This is the **only file you need to edit**. This file acts as the "single source of truth" for the entire application.

**File:** `src/lib/sensorConfig.ts`

### 1\. Import a new icon

At the top of the file, import the icon you want to use from `lucide-react`.

```typescript
// src/lib/sensorConfig.ts

import {
  Thermometer,
  Droplets,
  Gauge,
  MapPin,
  Wind, // <-- ADD YOUR NEW ICON HERE
  LucideIcon,
} from "lucide-react";
```

### 2\. Add a new configuration object

Add a new object for your sensor to the `sensorConfig` array. The order in this array is the order they will appear on the dashboard.

```typescript
// src/lib/sensorConfig.ts

// ... (SensorConfig interface)

// --- MASTER SENSOR CONFIGURATION ---
// This is the only array you need to edit to add or remove sensors.
export const sensorConfig: SensorConfig[] = [
  // ... (existing configs for temperature, humidity, air_pressure, location)
  {
    sensorId: "air_pressure",
    // ...
  },
  {
    sensorId: "location",
    // ...
  },

  // --- ADD YOUR NEW SENSOR CONFIGURATION HERE ---
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
  // --- END NEW SENSOR ---
];

// ... (sensorConfigMap)
```

### Configuration Options Explained:

- **`sensorId`**: The exact name of the sensor you send in the JSON (e.g., `"wind_speed"`).
- **`title`**: The display name for the card (e.g., "Windstärke").
- **`unit`**: The fallback unit if the database doesn't provide one. Also used for labels.
- **`icon`**: The icon component you imported (`Wind`).
- **`formatting`**: A function to format the numeric value (e.g., `value.toFixed(1)`).
- **`iconColor`, `bgColor`, etc.**: Tailwind CSS classes for styling the card.
- **`showInHistory`**: **(Set to `true`)** Automatically adds the sensor to the `/history` page chart.
- **`showInDownload`**: **(Set to `true`)** Automatically adds the sensor as an option in the CSV download modal.
- **`description`**: Text shown in the download modal.
- **`chartColor`**: The line color for the history chart.
- **`chartYAxis`**: Which axis to use on the chart (`y` = left, `y2` = right).

---

## Step 3: You're Done\!

That's it. By adding that single object, the application will automatically:

1.  **Fetch Latest Data:** The `/api/latest` route will now query for `"wind_speed"` and include it in its response.
2.  **Display Card:** The homepage will create a new state and render a new card for "Windstärke".
3.  **Enable Download:** The CSV Export modal will show "Windstärke" as a selectable option.
4.  **Show History:** The `/history` page will add a new line to the chart for "Windstärke".
