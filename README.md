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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM
- [PostgreSQL Documentation](https://www.postgresql.org/docs) - learn about PostgreSQL

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to set your `DATABASE_URL` environment variable in the Vercel project settings.
