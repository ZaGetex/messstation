import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch the latest reading for each sensor type
    const [temperature, humidity, pressure, location] = await Promise.all([
      prisma.sensorData.findFirst({
        where: { sensor: 'temperature' },
        orderBy: { ts: 'desc' },
      }),
      prisma.sensorData.findFirst({
        where: { sensor: 'humidity' },
        orderBy: { ts: 'desc' },
      }),
      prisma.sensorData.findFirst({
        where: { sensor: 'air_pressure' },
        orderBy: { ts: 'desc' },
      }),
      prisma.sensorData.findFirst({
        where: { 
          OR: [
            { sensor: 'location' },
            { sensor: 'gps' },
          ]
        },
        orderBy: { ts: 'desc' },
      }),
    ])

    return NextResponse.json({
      temperature: temperature ? {
        value: temperature.value,
        unit: temperature.unit,
        ts: temperature.ts,
      } : null,
      humidity: humidity ? {
        value: humidity.value,
        unit: humidity.unit,
        ts: humidity.ts,
      } : null,
      pressure: pressure ? {
        value: pressure.value,
        unit: pressure.unit,
        ts: pressure.ts,
      } : null,
      location: location ? {
        value: location.unit, // Location stored in unit field (e.g., "Berlin, DE")
        ts: location.ts,
      } : null,
    })
  } catch (error) {
    console.error('Error fetching latest sensor data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch latest sensor data' },
      { status: 500 }
    )
  }
}

