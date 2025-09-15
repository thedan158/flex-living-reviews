import { NextResponse } from 'next/server';
import { reviewRepository } from '../../../../lib/services/database/repositories/ReviewRepository';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, approved }: { reviewId: string; approved: boolean } = body;

    if (!reviewId) {
      return NextResponse.json({
        success: false,
        message: 'Review ID is required'
      }, { status: 400 });
    }

    // Update the review approval status in the database
    const updatedReview = await reviewRepository.approveReview(reviewId, approved);

    if (updatedReview) {
      console.log(`Review ${reviewId} ${approved ? 'approved' : 'rejected'}`);

      return NextResponse.json({
        success: true,
        message: `Review ${approved ? 'approved' : 'rejected'}`,
        review: updatedReview
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Review not found'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error approving review:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update review approval status'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json({
        success: false,
        message: 'Review ID is required'
      }, { status: 400 });
    }

    // Get the approval status from the database
    const isApproved = await reviewRepository.getApprovalStatus(reviewId);

    return NextResponse.json({
      success: true,
      reviewId,
      approved: isApproved
    });
  } catch (error) {
    console.error('Error getting approval status:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to get approval status'
    }, { status: 500 });
  }
}
