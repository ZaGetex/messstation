// src/app/api/latest/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sensorConfig } from "@/lib/sensorConfig";

export async function GET() {
  try {
    // 1. Get all sensor IDs from the config, excluding "location"
    const sensorQueries = sensorConfig
      .filter((s) => s.sensorId !== "location")
      .map((sensor) => {
        return prisma.sensorData.findFirst({
          where: { sensor: sensor.sensorId },
          orderBy: { ts: "desc" },
        });
      });

    // 2. Add the special location query
    const locationQuery = prisma.sensorData.findFirst({
      where: {
        OR: [{ sensor: "location" }, { sensor: "gps" }],
      },
      orderBy: { ts: "desc" },
    });

    // 3. Run all queries in parallel
    const results = await Promise.all([...sensorQueries, locationQuery]);

    // 4. Dynamically build the response object
    const response: { [key: string]: any } = {};
    let i = 0;
    for (const sensor of sensorConfig) {
      if (sensor.sensorId === "location") {
        // Handle location query (it's the last one in the results array)
        const locationData = results[results.length - 1];
        response.location = locationData
          ? {
              value: locationData.unit, // Location stored in unit field (e.g., "Berlin, DE")
              ts: locationData.ts,
            }
          : null;
      } else {
        // Handle all other sensors
        const sensorData = results[i];
        response[sensor.sensorId] = sensorData
          ? {
              value: sensorData.value,
              unit: sensorData.unit,
              ts: sensorData.ts,
            }
          : null;
        i++; // Increment index for results array
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching latest sensor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest sensor data" },
      { status: 500 }
    );
  }
}