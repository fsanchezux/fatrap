import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single sidebar option
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const optionId = parseInt(id, 10)

    if (isNaN(optionId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const option = await prisma.sidebarOption.findUnique({
      where: { id: optionId },
      include: { section: true },
    })

    if (!option) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 })
    }

    return NextResponse.json(option)
  } catch (error) {
    console.error('Error fetching sidebar option:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sidebar option' },
      { status: 500 }
    )
  }
}

// PUT update a sidebar option
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const optionId = parseInt(id, 10)

    if (isNaN(optionId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, icon, path, color, order } = body

    const option = await prisma.sidebarOption.update({
      where: { id: optionId },
      data: {
        ...(name && { name }),
        ...(icon && { icon }),
        ...(path && { path }),
        ...(color !== undefined && { color }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json(option)
  } catch (error) {
    console.error('Error updating sidebar option:', error)
    return NextResponse.json(
      { error: 'Failed to update sidebar option' },
      { status: 500 }
    )
  }
}

// DELETE a sidebar option
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const optionId = parseInt(id, 10)

    if (isNaN(optionId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    await prisma.sidebarOption.delete({
      where: { id: optionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sidebar option:', error)
    return NextResponse.json(
      { error: 'Failed to delete sidebar option' },
      { status: 500 }
    )
  }
}
