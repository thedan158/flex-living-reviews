import { NextResponse } from 'next/server';
import { mockHostawayReviews } from '../../../lib/services/hostaway/mockData';
import { normalizeReviews } from '../../../lib/utils/reviewNormalizer';

export async function GET() {
  // Normalize the mock data before returning
  const normalizedReviews = normalizeReviews(mockHostawayReviews);
  return NextResponse.json({ reviews: normalizedReviews });
}
