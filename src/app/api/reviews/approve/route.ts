import { NextResponse } from 'next/server';
import { mockHostawayReviews } from '../../../../lib/services/hostaway/mockData';
import { storageService } from '../../../../lib/services/storage';
import { Review } from '../../../../types/review';

export async function POST(request: Request) {
  const body = await request.json();
  const { reviewId, approved }: { reviewId: string; approved: boolean } = body;

  // Find the review in mock data to verify it exists
  const reviewIndex = mockHostawayReviews.findIndex((review: Review) => review.id === reviewId);

  if (reviewIndex !== -1) {
    // Persist the approval status using the storage service
    storageService.setApprovalStatus(reviewId, approved);
    console.log(`Review ${reviewId} ${approved ? 'approved' : 'rejected'}`);

    // Return the review with the updated approval status
    const review = { ...mockHostawayReviews[reviewIndex], approved };

    return NextResponse.json({
      success: true,
      message: `Review ${approved ? 'approved' : 'rejected'}`,
      review
    });
  } else {
    return NextResponse.json({
      success: false,
      message: 'Review not found'
    }, { status: 404 });
  }
}
