import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? searchParams.get('search') ?? undefined;
    const state = searchParams.get('state') ?? undefined;
    const location = searchParams.get('location') ?? undefined;
    const minFee = parseNumber(searchParams.get('minFee') ?? searchParams.get('minFees'));
    const maxFee = parseNumber(searchParams.get('maxFee') ?? searchParams.get('maxFees'));
    const minRating = parseNumber(searchParams.get('minRating'));
    const sortBy = searchParams.get('sortBy') ?? searchParams.get('sort') ?? 'relevance';
    const page = parsePositiveInteger(searchParams.get('page'), 1);
    const limit = Math.min(
      parsePositiveInteger(searchParams.get('limit'), DEFAULT_LIMIT),
      MAX_LIMIT,
    );

    const where = {
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' as const } },
              { location: { contains: query, mode: 'insensitive' as const } },
              { state: { contains: query, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(state ? { state: { contains: state, mode: 'insensitive' as const } } : {}),
      ...(location ? { location: { contains: location, mode: 'insensitive' as const } } : {}),
      ...((minFee !== undefined || maxFee !== undefined)
        ? {
            fees: {
              ...(minFee !== undefined ? { gte: minFee } : {}),
              ...(maxFee !== undefined ? { lte: maxFee } : {}),
            },
          }
        : {}),
      ...(minRating !== undefined ? { rating: { gte: minRating } } : {}),
    };

    const skip = (page - 1) * limit;
    const orderBy = getOrderBy(sortBy);

    const [colleges, total] = await prisma.$transaction([
      prisma.college.findMany({
        where,
        include: { courses: true, placement: true, cutoffs: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch colleges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 },
    );
  }
}

function parseNumber(value: string | null) {
  if (value === null || value.trim() === '') return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function parsePositiveInteger(value: string | null, fallback: number) {
  if (value === null || value.trim() === '') return fallback;

  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function getOrderBy(sort: string) {
  switch (sort) {
    case 'price_asc':
      return { fees: 'asc' as const };
    case 'price_desc':
      return { fees: 'desc' as const };
    case 'newest':
      return { createdAt: 'desc' as const };
    case 'name_asc':
      return { name: 'asc' as const };
    case 'rating_desc':
      return { rating: 'desc' as const };
    case 'relevance':
    default:
      return { rating: 'desc' as const };
  }
}
