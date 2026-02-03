import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all sidebar sections with their options
export async function GET() {
  try {
    const sections = await prisma.sidebarSection.findMany({
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching sidebar options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sidebar options' },
      { status: 500 }
    )
  }
}

// POST create a new sidebar option
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, icon, path, color, sectionId, order } = body

    if (!name || !icon || !path || !sectionId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, icon, path, sectionId' },
        { status: 400 }
      )
    }

    const option = await prisma.sidebarOption.create({
      data: {
        name,
        icon,
        path,
        color,
        sectionId,
        order: order || 0,
      },
    })

    return NextResponse.json(option, { status: 201 })
  } catch (error) {
    console.error('Error creating sidebar option:', error)
    return NextResponse.json(
      { error: 'Failed to create sidebar option' },
      { status: 500 }
    )
  }
}
