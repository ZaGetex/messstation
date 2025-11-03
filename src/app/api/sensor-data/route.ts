import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.cluster || !body.sensor || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: cluster, sensor, and value' },
        { status: 400 }
      )
    }

    // Parse timestamp if provided, otherwise use current time
    const timestamp = body.ts ? new Date(body.ts) : new Date()

    // Create sensor data entry
    const sensorData = await prisma.sensorData.create({
      data: {
        cluster: body.cluster,
        sensor: body.sensor,
        value: body.value,
        unit: body.unit || null,
        ts: timestamp,
      },
    })

    return NextResponse.json(
      { 
        message: 'Sensor data saved successfully',
        data: sensorData 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving sensor data:', error)
    return NextResponse.json(
      { error: 'Failed to save sensor data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cluster = searchParams.get('cluster')
    const sensor = searchParams.get('sensor')
    const limit = parseInt(searchParams.get('limit') || '100')
    const orderBy = searchParams.get('orderBy') || 'desc'

    // Build where clause
    const where: any = {}
    if (cluster) where.cluster = cluster
    if (sensor) where.sensor = sensor

    // Fetch sensor data
    const data = await prisma.sensorData.findMany({
      where,
      take: limit,
      orderBy: {
        ts: orderBy === 'asc' ? 'asc' : 'desc',
      },
    })

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching sensor data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sensor data' },
      { status: 500 }
    )
  }
}

