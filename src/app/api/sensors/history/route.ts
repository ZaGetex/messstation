/**
 * API route: GET /api/sensors/history?range=1h
 * Fetches sensor data for the specified time range for history charts
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getStartDateForRange } from "@/lib/utils/time";
import { RangeKey } from "@/types/api";
import { HistoryChartResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") as RangeKey) || "1h";

    const startDate = getStartDateForRange(range);

    // Fetch all sensor data within the time range, ordered by time.
    // The frontend will be responsible for filtering and bucketing.
    const data = await prisma.sensorData.findMany({
      where: {
        ts: {
          gte: startDate, // "greater than or equal to" the start date
        },
      },
      orderBy: {
        ts: "asc", // Chart.js needs data to be in ascending order
      },
      select: {
        ts: true,
        sensor: true,
        value: true,
        unit: true,
      },
    });

    // Convert dates to ISO strings for JSON serialization
    const formattedData = data.map((item) => ({
      ...item,
      ts: item.ts.toISOString(),
    }));

    const response: HistoryChartResponse = { data: formattedData };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching history data:", error);
    return NextResponse.json(
      { error: "Failed to fetch history data" },
      { status: 500 }
    );
  }
}

