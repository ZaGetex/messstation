import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { SensorData } from '@prisma/client';

/**
 * Converts an array of SensorData objects into a CSV string.
 * This function is easily expandable by adding/removing fields from the headers array.
 * @param data Array of SensorData objects from Prisma.
 * @returns A string formatted as a CSV.
 */
function convertToCSV(data: SensorData[]): string {
  if (data.length === 0) {
    return 'id,ts,cluster,sensor,value,unit\nNo data found for the selected criteria.';
  }

  // Define the headers for your CSV.
  // This is the main place to add/remove columns if your data model changes.
  const headers = ['id', 'ts', 'cluster', 'sensor', 'value', 'unit'];
  
  // Create the header row
  const headerRow = headers.join(',') + '\n';

  // Map each data object to a CSV row
  const rows = data.map(row => {
    // Escape commas within values by wrapping in double quotes
    const escape = (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      // If the string contains a comma, wrap it in double quotes
      if (str.includes(',')) return `"${str}"`;
      return str;
    };

    return [
      row.id,
      row.ts.toISOString(),
      escape(row.cluster),
      escape(row.sensor),
      row.value,
      escape(row.unit)
    ].join(',');
  });

  return headerRow + rows.join('\n');
}

/**
 * GET handler for /api/export-csv
 * Expects search parameters for filtering the data.
 *
 * @param request NextRequest object containing URL search params
 * @returns A NextResponse object with the CSV data as a downloadable file.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get filter parameters from the URL
    const dataTypes = searchParams.get('dataTypes')?.split(',') || [];
    const timeSpan = searchParams.get('timeSpan');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // --- 1. Build Sensor Filter ---
    // This is designed to be expandable. If the frontend sends new sensor names
    // in the `dataTypes` array, this query will automatically include them.
    const sensorFilter: any = {};
    if (dataTypes.length > 0 && !dataTypes.includes('all')) {
      sensorFilter.sensor = {
        in: dataTypes,
      };
    }
    // If dataTypes is ['all'] or empty, we don't add a sensor filter.

    // --- 2. Build Date Filter ---
    const dateFilter: any = {};
    const now = new Date();

    if (timeSpan === 'custom' && startDate && endDate) {
      dateFilter.ts = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else {
      let startTime: Date | undefined;
      switch (timeSpan) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '2h':
          startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000);
          break;
        case '6h':
          startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          break;
        case '12h':
          startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
          break;
        case '1d':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '1w':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          // Default to last 24 hours if no valid timespan is provided
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
      }
      if (startTime) {
        dateFilter.ts = { gte: startTime };
      }
    }

    // --- 3. Query Database ---
    const data = await prisma.sensorData.findMany({
      where: {
        ...sensorFilter,
        ...dateFilter,
      },
      orderBy: {
        ts: 'asc', // Order chronologically for CSV
      },
    });

    // --- 4. Generate CSV ---
    const csv = convertToCSV(data);

    // --- 5. Return File Response ---
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment; filename="messstation-export-${Date.now()}.csv"`);

    return new NextResponse(csv, { status: 200, headers });

  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV data' },
      { status: 500 }
    );
  }
}
