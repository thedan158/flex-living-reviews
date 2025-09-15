import { NextResponse } from 'next/server';
import { mockHostawayReviews } from '../../../../lib/services/hostaway/mockData';
import { Review } from '../../../../types/review';

export async function POST(request: Request) {
  const body = await request.json();
  const { reviewId, approved }: { reviewId: string; approved: boolean } = body;

  // Find and update the review in mock data
  const reviewIndex = mockHostawayReviews.findIndex((review: Review) => review.id === reviewId);

  if (reviewIndex !== -1) {
    mockHostawayReviews[reviewIndex].approved = approved;
    console.log(`Review ${reviewId} ${approved ? 'approved' : 'rejected'}`);

    return NextResponse.json({
      success: true,
      message: `Review ${approved ? 'approved' : 'rejected'}`,
      review: mockHostawayReviews[reviewIndex]
    });
  } else {
    return NextResponse.json({
      success: false,
      message: 'Review not found'
    }, { status: 404 });
  }
}
