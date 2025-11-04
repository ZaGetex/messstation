import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RangeKey = "1h" | "5h" | "1d" | "1w";

/**
 * Calculates the start date based on the provided time range.
 */
function getStartDate(range: RangeKey): Date {
  const now = new Date();
  switch (range) {
    case "1h":
      now.setHours(now.getHours() - 1);
      return now;
    case "5h":
      now.setHours(now.getHours() - 5);
      return now;
    case "1d":
      now.setDate(now.getDate() - 1);
      return now;
    case "1w":
      now.setDate(now.getDate() - 7);
      return now;
    default:
      // Default to 1 hour if range is invalid
      now.setHours(now.getHours() - 1);
      return now;
  }
}

/**
 * GET /api/history-chart?range=1h
 *
 * Fetches sensor data for the specified time range.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") as RangeKey) || "1h";

    const startDate = getStartDate(range);

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

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching history data:", error);
    return NextResponse.json(
      { error: "Failed to fetch history data" },
      { status: 500 }
    );
  }
}
