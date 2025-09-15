import { NextResponse } from 'next/server';
import { propertiesRepository } from '../../../lib/services/database/repositories/PropertiesRepository';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const minRating = searchParams.get('minRating');
    const maxPrice = searchParams.get('maxPrice');
    const amenities = searchParams.get('amenities');
    const limit = searchParams.get('limit');
    const skip = searchParams.get('skip');

    const filter: any = {};

    if (location) filter.location = location;
    if (minRating) filter.minRating = parseFloat(minRating);
    if (maxPrice) filter.maxPrice = parseFloat(maxPrice);
    if (amenities) filter.amenities = amenities.split(',');
    if (limit) filter.limit = parseInt(limit);
    if (skip) filter.skip = parseInt(skip);

    const properties = await propertiesRepository.findAll(filter);

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
