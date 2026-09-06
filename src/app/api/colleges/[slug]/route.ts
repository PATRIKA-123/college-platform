import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placement: true,
        cutoffs: true,
        reviews: true,
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json({ data: college }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch college by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch college details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const existingCollege = await prisma.college.findUnique({
      where: { slug },
    });

    if (!existingCollege) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const {
      name,
      location,
      state,
      fees,
      rating,
      description,
      establishedYear,
      averagePackage,
      highestPackage,
      placementRate,
      newSlug,
    } = body;

    const updatedCollege = await prisma.college.update({
      where: { slug },
      data: {
        ...(name ? { name } : {}),
        ...(location ? { location } : {}),
        ...(state ? { state } : {}),
        ...(fees !== undefined ? { fees: Number(fees) } : {}),
        ...(rating !== undefined ? { rating: Number(rating) } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(establishedYear !== undefined ? { establishedYear: Number(establishedYear) } : {}),
        ...(newSlug ? { slug: newSlug } : {}),
        ...(averagePackage !== undefined || highestPackage !== undefined || placementRate !== undefined
          ? {
              placement: {
                upsert: {
                  create: {
                    averagePackage: Number(averagePackage) || 0,
                    highestPackage: Number(highestPackage) || 0,
                    placementRate: Number(placementRate) || 0,
                  },
                  update: {
                    ...(averagePackage !== undefined
                      ? { averagePackage: Number(averagePackage) }
                      : {}),
                    ...(highestPackage !== undefined
                      ? { highestPackage: Number(highestPackage) }
                      : {}),
                    ...(placementRate !== undefined
                      ? { placementRate: Number(placementRate) }
                      : {}),
                  },
                },
              },
            }
          : {}),
      },
      include: {
        placement: true,
        courses: true,
        cutoffs: true,
        reviews: true,
      },
    });

    return NextResponse.json({ data: updatedCollege }, { status: 200 });
  } catch (error) {
    console.error('Failed to update college:', error);
    return NextResponse.json(
      { error: 'Failed to update college. Slug may already exist.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existingCollege = await prisma.college.findUnique({
      where: { slug },
    });

    if (!existingCollege) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    await prisma.college.delete({
      where: { slug },
    });

    return NextResponse.json(
      { success: true, message: 'College deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete college:', error);
    return NextResponse.json(
      { error: 'Failed to delete college' },
      { status: 500 }
    );
  }
}
