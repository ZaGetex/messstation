/**
 * API route: GET /api/sensors/latest
 * Returns the latest sensor data for all configured sensors
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sensorConfig } from "@/lib/config/sensors";
import { LatestSensorDataResponse } from "@/types/api";

export async function GET() {
  try {
    // Get all sensor IDs from the config, excluding "location"
    const sensorQueries = sensorConfig
      .filter((s) => s.sensorId !== "location")
      .map((sensor) => {
        return prisma.sensorData.findFirst({
          where: { sensor: sensor.sensorId },
          orderBy: { ts: "desc" },
        });
      });

    // Add the special location query
    const locationQuery = prisma.sensorData.findFirst({
      where: {
        OR: [{ sensor: "location" }, { sensor: "gps" }],
      },
      orderBy: { ts: "desc" },
    });

    // Latest GNSS position (cluster=gnss, sensor=lon / sensor=lat in deg)
    const gnssLonQuery = prisma.sensorData.findFirst({
      where: { cluster: "gnss", sensor: "lon" },
      orderBy: { ts: "desc" },
    });
    const gnssLatQuery = prisma.sensorData.findFirst({
      where: { cluster: "gnss", sensor: "lat" },
      orderBy: { ts: "desc" },
    });

    // Run all queries in parallel for better performance
    const results = await Promise.all([
      ...sensorQueries,
      locationQuery,
      gnssLonQuery,
      gnssLatQuery,
    ]);

    // Dynamically build the response object
    const response: LatestSensorDataResponse = {};
    let i = 0;
    for (const sensor of sensorConfig) {
      if (sensor.sensorId === "location") {
        // Handle location query (index: sensorQueries.length)
        const locationData = results[sensorQueries.length];
        response.location = locationData
          ? {
              value: locationData.unit || "", // Location stored in unit field
              ts: locationData.ts.toISOString(),
            }
          : null;
      } else {
        // Handle all other sensors
        const sensorData = results[i];
        response[sensor.sensorId] = sensorData
          ? {
              value: sensorData.value,
              unit: sensorData.unit,
              ts: sensorData.ts.toISOString(),
            }
          : null;
        i++;
      }
    }

    // GNSS position (cluster gnss: lon, lat in deg)
    const gnssLon = results[results.length - 2];
    const gnssLat = results[results.length - 1];
    if (gnssLon && gnssLat) {
      response.gnss_lon = {
        value: gnssLon.value,
        unit: gnssLon.unit ?? "deg",
        ts: gnssLon.ts.toISOString(),
      };
      response.gnss_lat = {
        value: gnssLat.value,
        unit: gnssLat.unit ?? "deg",
        ts: gnssLat.ts.toISOString(),
      };
    } else {
      response.gnss_lon = null;
      response.gnss_lat = null;
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

