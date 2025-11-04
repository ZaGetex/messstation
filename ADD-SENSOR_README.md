## How to Add a New Sensor (e.g., "Wind Speed")

This guide explains how to add a new sensor to the Messstation dashboard.

Your application is already highly modular. The database and the data-intake API are designed to accept *any* sensor data without any code changes.

The only parts that require updates are the specific UIs where you want to *display* this new data, such as the main dashboard.

Here is the step-by-step process, using a new "Wind Speed" sensor as an example.

---

## Step 1: Database & Data Ingestion (No Action Needed)

**This step is already complete.**

Your database schema (`prisma/schema.prisma`) uses a generic `SensorData` model with a `sensor` field (which is a string). This means it can store *any* sensor name you send it.

Likewise, the `/api/sensor-data` `POST` route is also generic. It takes the JSON body and saves it directly.

**All you have to do is configure your sensor hub (the device sending the data) to start sending new `POST` requests for `"wind_speed"`.**

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

## Step 2: Update the "Latest Data" API

To show the new sensor on the main dashboard, you must first update the `/api/latest/route.ts` endpoint so it fetches the latest value for "wind_speed".

**File:** `src/app/api/latest/route.ts`

**1. Add the new query:**
Add a new `prisma.sensorData.findFirst` query inside the `Promise.all` array for your new sensor.

```typescript
// ...
export async function GET() {
  try {
    // Fetch the latest reading for each sensor type
    const [temperature, humidity, pressure, location, wind_speed] = await Promise.all([
      prisma.sensorData.findFirst({
// ... (existing queries for temperature, humidity, pressure, location) ...
      }),
      prisma.sensorData.findFirst({
        where: { sensor: 'location' },
        orderBy: { ts: 'desc' },
      }),
      // ADD THIS NEW QUERY
      prisma.sensorData.findFirst({
        where: { sensor: 'wind_speed' },
        orderBy: { ts: 'desc' },
      }),
    ])

    return NextResponse.json({
// ... (existing properties: temperature, humidity, pressure, location) ...
      } : null,
      location: location ? {
// ...
      } : null,
      // ADD THIS NEW PROPERTY
      wind_speed: wind_speed ? {
        value: wind_speed.value,
        unit: wind_speed.unit,
        ts: wind_speed.ts,
      } : null,
    })
  } catch (error) {
// ...
```

---

## Step 3: Update the Dashboard UI

Now that the API is sending `wind_speed`, you can display it on the homepage.

**File:** `src/app/page.tsx`

**1. Import a new icon:**
Find a suitable icon from `lucide-react` (like `Wind`) and import it at the top.

```typescript
import { Download, MapPin, Thermometer, Droplets, Gauge, Wind } from "lucide-react";
```

**2. Add state for the new sensor:**
Add `wind_speed` and `lastUpdated.wind_speed` to the `useState` hook.

```typescript
// ...
export default function Home() {
  const [data, setData] = useState({
    location: "N/A",
    temperature: "N/A",
    humidity: "N/A",
    pressure: "N/A",
    wind_speed: "N/A", // <-- ADD THIS
    lastUpdated: {
      location: new Date(Date.now()), 
      temperature: new Date(Date.now()), 
      humidity: new Date(Date.now() ),
      pressure: new Date(Date.now()), 
      wind_speed: new Date(Date.now()), // <-- ADD THIS
    },
  });

  // Fetch latest sensor data from the API
  useEffect(() => {
// ...
        const latest = await response.json();

        setData((prev) => ({
// ... (existing properties: location, temperature, humidity, pressure) ...
              }`
            : prev.pressure,
          // ADD THIS
          wind_speed: latest.wind_speed
            ? `${latest.wind_speed.value.toFixed(1)} ${
                latest.wind_speed.unit || ""
              }`
            : prev.wind_speed,
          lastUpdated: {
// ... (existing lastUpdated properties) ...
            pressure: latest.pressure
              ? new Date(latest.pressure.ts)
              : prev.lastUpdated.pressure,
            // ADD THIS
            wind_speed: latest.wind_speed
              ? new Date(latest.wind_speed.ts)
              : prev.lastUpdated.wind_speed,
          },
        }));
      } catch (error) {
// ...
```

**3. Add the new card:**
Add a new card object to the `cardData` array. You can place it anywhere in the list.

```typescript
// ...
  const cardData = [
    {
      title: "Location",
// ...
    },
    // ... (temperature, humidity, pressure cards) ...
    {
      title: "Luftdruck",
// ...
      lastUpdated: data.lastUpdated.pressure,
    },
    // ADD THIS NEW CARD
    {
      title: "Windstärke",
      value: data.wind_speed,
      icon: Wind,
      iconColor: "text-gray-500",
      bgColor: "bg-gray-500/10",
      shadowColor: "shadow-gray-500/20",
      borderColor: "hover:border-gray-500/50",
      hoverTextColor: "group-hover:text-gray-600",
      lastUpdated: data.lastUpdated.wind_speed,
    },
  ];

  return (
// ...
```

---

## Step 4: Update the CSV Export Modal (Optional)

To make the new sensor selectable in the download modal, add it to the `dataTypeOptions`.

**File:** `src/components/DownloadButton.tsx`

```typescript
// ...
const dataTypeOptions: {
// ...
  { value: "pressure", label: "Luftdruck", description: "Druckdaten in hPa" },
  {
    value: "location",
// ...
  },
  // ADD THIS NEW OPTION
  {
    value: "wind_speed",
    label: "Windstärke",
    description: "Winddaten in km/h",
  },
  {
    value: "all",
// ...
```

The backend (`/api/export-csv`) is already modular and will automatically handle `"wind_speed"` if it's in the `dataTypes` array, so no backend changes are needed for the export.

