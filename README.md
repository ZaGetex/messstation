# Barkasse Messstation Web

This is a [Next.js](https://nextjs.org) project for displaying and managing sensor data from the Barkasse Messstation.

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database running

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   - Create a `.env` file in the root directory
   - Add your database URL:

   ```
   DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
   ```

   Example: `DATABASE_URL="postgresql://postgres:sql@localhost:5432/messstation"`

3. **Initialize the database:**

   ```bash
   npm run db:push
   ```

4. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                          # Next.js App Router 
│   ├── api/
│   │   └── sensors/              # API Routes gruppiert nach Domain
│   │       ├── latest/
│   │       ├── history/
│   │       ├── data/
│   │       └── export/
│   ├── history/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # Komponenten nach Feature gruppiert
│   ├── layout/                   # Layout-Komponenten
│   │   ├── Header.tsx
│   │   ├── Logo.tsx
│   │   └── DateTime.tsx
│   ├── sensors/                  # Sensor-spezifische Komponenten
│   │   ├── SensorCard.tsx        
│   │   └── MultiSensorCard.tsx
│   ├── charts/                   # Chart-Komponenten
│   │   └── HistoryChart.tsx      
│   ├── map/                      # Map-Komponenten
│   │   └── LocationMap.tsx
│   ├── export/                   # Export-Komponenten
│   │   └── DownloadButton.tsx
│   └── ui/                       # Wiederverwendbare UI-Komponenten
│       ├── ThemeToggle.tsx
│       └── LanguageToggle.tsx
│
├── hooks/                        # Custom React Hooks
│   ├── useSensorData.ts          # Sensor-Daten Fetching
│   ├── useTimeStatus.ts          # Zeit-Status Berechnung
│   └── useChartData.ts           # Chart-Daten Verarbeitung
│
├── lib/                          # Utilities & Configuration
│   ├── config/                   # Konfigurationsdateien
│   │   ├── sensors.ts            # (vorher sensorConfig.ts)
│   │   └── translations.ts
│   ├── db/                       # Database Utilities
│   │   └── prisma.ts
│   ├── utils/                    # Helper-Funktionen
│   │   ├── time.ts               # Zeit-bezogene Utilities
│   │   ├── csv.ts                # CSV-Utilities
│   │   ├── chart.ts              # Chart-Utilities
│   │   └── formatting.ts         # Formatierungs-Utilities
│   └── constants/                # Konstanten
│       └── timeRanges.ts         # Zeitbereichs-Konstanten
│
├── types/                        # TypeScript Type Definitions
│   ├── sensor.ts                 # Sensor-bezogene Types
│   ├── api.ts                    # API Response Types
│   └── chart.ts                  # Chart-bezogene Types
│
└── contexts/                     # React Contexts
    ├── LanguageContext.tsx
    └── ThemeContext.tsx
```

## Database Management

### View Your Data

**Option 1: Prisma Studio (Recommended)**

```bash
npm run db:studio
```

This opens a visual database browser at [http://localhost:5555](http://localhost:5555) where you can:

- View all sensor data
- Filter and search records
- Edit and delete entries
- Create new entries manually

**Option 2: PostgreSQL CLI**

```bash
# Connect to your database
psql -U postgres -d messstation

# View all sensor data
SELECT * FROM sensor_data;

# View latest 10 records
SELECT * FROM sensor_data ORDER BY ts DESC LIMIT 10;

# Filter by sensor type
SELECT * FROM sensor_data WHERE sensor = 'temperature';

# Exit
\q
```

### Database Schema

The `sensor_data` table structure:

- `id` (SERIAL PRIMARY KEY) - Auto-incrementing unique ID
- `cluster` (VARCHAR(50)) - Sensor cluster/group (e.g., "weather")
- `sensor` (VARCHAR(50)) - Sensor type (e.g., "temperature", "humidity")
- `value` (DOUBLE PRECISION) - Numeric sensor value
- `unit` (VARCHAR(10)) - Measurement unit (e.g., "°C", "hPa", "%")
- `ts` (TIMESTAMP WITH TIME ZONE) - Timestamp, defaults to NOW()

### Useful Database Commands

- `npm run db:migrate` - Create and apply migrations
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:studio` - Open Prisma Studio GUI

## API Endpoints

### POST `/api/sensor-data`

Receives sensor data from the offsite sensor hub and stores it in the database.

**Request Body:**

```json
{
  "cluster": "weather",
  "sensor": "temperature",
  "value": 22.4,
  "unit": "°C",
  "ts": "2025-10-10T12:00:00Z"
}
```

**Response (201 Created):**

```json
{
  "message": "Sensor data saved successfully",
  "data": {
    "id": 1,
    "cluster": "weather",
    "sensor": "temperature",
    "value": 22.4,
    "unit": "°C",
    "ts": "2025-10-10T12:00:00Z"
  }
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/sensor-data -H "Content-Type: application/json" -d "{\"cluster\": \"weather\", \"sensor\": \"temperature\", \"value\": 22.4, \"unit\": \"°C\", \"ts\": \"2025-10-10T12:00:00Z\"}"
```

### GET `/api/sensor-data`

Retrieve sensor data with optional filters.

**Query Parameters:**

- `cluster` - Filter by cluster
- `sensor` - Filter by sensor type
- `limit` - Number of records to return (default: 100)
- `orderBy` - Sort order: "asc" or "desc" (default: "desc")

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": 1,
      "cluster": "weather",
      "sensor": "temperature",
      "value": 22.4,
      "unit": "°C",
      "ts": "2025-10-10T12:00:00Z"
    }
  ]
}
```

**Examples:**

```bash
# Get all data
curl http://localhost:3000/api/sensor-data

# Get last 10 temperature readings
curl "http://localhost:3000/api/sensor-data?sensor=temperature&limit=10"

# Get all humidity data
curl "http://localhost:3000/api/sensor-data?sensor=humidity"

# Get weather cluster data
curl "http://localhost:3000/api/sensor-data?cluster=weather"
```

### GET `/api/latest`

Retrieves the latest reading for each sensor configured in `sensorConfig.ts`. This endpoint is used by the homepage dashboard to display current sensor values.

**Response (200 OK):**

```json
{
  "temperature": {
    "value": 22.4,
    "unit": "°C",
    "ts": "2025-10-10T12:00:00Z"
  },
  "humidity": {
    "value": 65.0,
    "unit": "%",
    "ts": "2025-10-10T12:00:00Z"
  },
  "location": {
    "value": "Berlin, DE",
    "ts": "2025-10-10T12:00:00Z"
  }
}
```

**Example:**

```bash
curl http://localhost:3000/api/latest
```

### GET `/api/history-chart`

Retrieves sensor data for the history chart page. Returns data within a specified time range.

**Query Parameters:**

- `range` - Time range: "1h", "5h", "1d", or "1w" (default: "1h")

**Response (200 OK):**

```json
{
  "data": [
    {
      "ts": "2025-10-10T12:00:00Z",
      "sensor": "temperature",
      "value": 22.4,
      "unit": "°C"
    }
  ]
}
```

**Examples:**

```bash
# Get last hour of data
curl "http://localhost:3000/api/history-chart?range=1h"

# Get last day of data
curl "http://localhost:3000/api/history-chart?range=1d"
```

### GET `/api/export-csv`

Exports sensor data as a CSV file with optional filtering by sensor type and time range.

**Query Parameters:**

- `dataTypes` - Comma-separated list of sensor IDs (e.g., "temperature,humidity") or "all" for all sensors
- `timeSpan` - Time range: "1h", "2h", "6h", "12h", "1d", "1w", or "custom"
- `startDate` - Start date (ISO format, required if timeSpan is "custom")
- `endDate` - End date (ISO format, required if timeSpan is "custom")

**Response (200 OK):**

Returns a CSV file with headers: `id,ts,cluster,sensor,value,unit`

**Examples:**

```bash
# Export all temperature data from last 24 hours
curl "http://localhost:3000/api/export-csv?dataTypes=temperature&timeSpan=1d" -o export.csv

# Export multiple sensors from last week
curl "http://localhost:3000/api/export-csv?dataTypes=temperature,humidity,air_pressure&timeSpan=1w" -o export.csv

# Export custom date range
curl "http://localhost:3000/api/export-csv?dataTypes=all&timeSpan=custom&startDate=2025-10-01T00:00:00Z&endDate=2025-10-10T23:59:59Z" -o export.csv
```

## Features

### Dashboard

The homepage displays real-time sensor data in card format. Each sensor card shows:
- Current value with unit
- Last update timestamp with status indicator (green = <1min, orange = <5min, red = older)
- Auto-refreshes every 30 seconds

### History Page

Access the history page at `/history` to view historical sensor data in an interactive chart. Features:
- Time range selection (1 hour, 5 hours, 1 day, 1 week)
- Multiple sensor lines with trendlines
- Dual Y-axis support for sensors with different scales
- Responsive design for mobile and desktop

### CSV Export

The download button on the homepage and history page allows exporting sensor data as CSV:
- Filter by sensor type(s)
- Select time range (1h, 2h, 6h, 12h, 1d, 1w, or custom date range)
- Download filtered data for analysis

### Multi-Language Support

The application supports German (DE) and English (EN) languages:
- Language toggle in the header
- All UI text is translated
- Sensor titles and descriptions support both languages

### Theme Support

Dark and light themes are available:
- Theme toggle in the header
- Theme preference is persisted
- Smooth transitions between themes

### Multi-Sensor Cards

Group related sensors into a single larger card. See `MULTI-SENSOR-CARD_README.md` for configuration details.

## Using Prisma Client

Import and use the Prisma client in your code:

```typescript
import { prisma } from "@/lib/prisma";

// Fetch all sensor data
const data = await prisma.sensorData.findMany();

// Fetch latest temperature reading
const latestTemp = await prisma.sensorData.findFirst({
  where: { sensor: "temperature" },
  orderBy: { ts: "desc" },
});

// Create new sensor data
const newData = await prisma.sensorData.create({
  data: {
    cluster: "weather",
    sensor: "temperature",
    value: 25.5,
    unit: "°C",
  },
});

// Count records
const count = await prisma.sensorData.count();
```

## Additional Documentation

- **[ADD-SENSOR_README.md](./ADD-SENSOR_README.md)** - Guide for adding new sensors to the dashboard
- **[MULTI-SENSOR-CARD_README.md](./MULTI-SENSOR-CARD_README.md)** - Guide for configuring multi-sensor cards

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM
- [PostgreSQL Documentation](https://www.postgresql.org/docs) - learn about PostgreSQL

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to set your `DATABASE_URL` environment variable in the Vercel project settings.
