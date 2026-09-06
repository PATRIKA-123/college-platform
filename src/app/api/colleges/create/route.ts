import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      location,
      state,
      fees,
      rating,
      description,
      establishedYear,
      averagePackage,
      highestPackage,
      placementRate,
    } = body;

    if (!name || !slug || !location || !state || !fees) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const newCollege = await prisma.college.create({
      data: {
        name,
        slug,
        location,
        state,
        fees: Number(fees),
        rating: Number(rating) || 4.0,
        description: description || '',
        establishedYear: Number(establishedYear) || 2000,
        placement:
          averagePackage || highestPackage
            ? {
                create: {
                  averagePackage: Number(averagePackage) || 0,
                  highestPackage: Number(highestPackage) || 0,
                  placementRate: Number(placementRate) || 0,
                },
              }
            : undefined,
      },
    });

    return NextResponse.json({ success: true, data: newCollege }, { status: 201 });
  } catch (error) {
    console.error('Failed to create college:', error);
    return NextResponse.json(
      { error: 'Failed to create college. Slug might already exist.' },
      { status: 500 }
    );
  }
}