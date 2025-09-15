import { NextResponse } from 'next/server';
import { mockHostawayReviews } from '../../../lib/services/hostaway/mockData';
import { normalizeReviews } from '../../../lib/utils/reviewNormalizer';
import { storageService } from '../../../lib/services/storage';

export async function GET() {
  // Normalize the mock data and merge with persistent approval status
  const normalizedReviews = normalizeReviews(mockHostawayReviews).map(review => ({
    ...review,
    approved: storageService.getApprovalStatus(review.id)
  }));

  return NextResponse.json({ reviews: normalizedReviews });
}
