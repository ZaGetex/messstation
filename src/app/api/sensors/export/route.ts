/**
 * API route: GET /api/sensors/export
 * Exports sensor data as CSV based on selected data types and time range
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { convertToCSV } from "@/lib/utils/csv";
import { getStartDateForTimeSpan } from "@/lib/utils/time";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get filter parameters from the URL
    const dataTypes = searchParams.get("dataTypes")?.split(",") || [];
    const timeSpan = searchParams.get("timeSpan");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build sensor filter
    // This is designed to be expandable. If the frontend sends new sensor names
    // in the `dataTypes` array, this query will automatically include them.
    const sensorFilter: any = {};
    if (dataTypes.length > 0 && !dataTypes.includes("all")) {
      sensorFilter.sensor = {
        in: dataTypes,
      };
    }
    // If dataTypes is ['all'] or empty, we don't add a sensor filter.

    // Build date filter
    const dateFilter: any = {};

    if (timeSpan === "custom" && startDate && endDate) {
      dateFilter.ts = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (timeSpan) {
      const startTime = getStartDateForTimeSpan(
        timeSpan as "1h" | "2h" | "6h" | "12h" | "1d" | "1w" | "custom"
      );
      if (startTime) {
        dateFilter.ts = { gte: startTime };
      }
    }

    // Query database
    const data = await prisma.sensorData.findMany({
      where: {
        ...sensorFilter,
        ...dateFilter,
      },
      orderBy: {
        ts: "asc", // Order chronologically for CSV
      },
    });

    // Generate CSV
    const csv = convertToCSV(data);

    // Return file response
    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set(
      "Content-Disposition",
      `attachment; filename="messstation-export-${Date.now()}.csv"`
    );

    return new NextResponse(csv, { status: 200, headers });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { error: "Failed to export CSV data" },
      { status: 500 }
    );
  }
}

