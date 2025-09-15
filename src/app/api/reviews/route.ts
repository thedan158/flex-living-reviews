import { NextResponse } from 'next/server';
import { reviewRepository } from '../../../lib/services/database/repositories/ReviewRepository';
import { normalizeReviews } from '../../../lib/utils/reviewNormalizer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    const channel = searchParams.get('channel');
    const status = searchParams.get('status');
    const approved = searchParams.get('approved');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build query options
    const options: any = {
      limit,
      skip,
    };

    if (listingId) options.listingId = listingId;
    if (channel) options.channel = channel;
    if (status) options.status = status;
    if (approved !== null) options.approved = approved === 'true';

    // Fetch reviews from database
    const reviews = await reviewRepository.findAll(options);

    // Normalize reviews for consistent format
    const normalizedReviews = normalizeReviews(reviews);

    return NextResponse.json({
      reviews: normalizedReviews,
      total: await reviewRepository.count(options),
      success: true
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviews } = body;

    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json(
        { error: 'Reviews array is required', success: false },
        { status: 400 }
      );
    }

    // Create reviews in database
    const createdReviews = await reviewRepository.bulkCreate(reviews);

    return NextResponse.json({
      reviews: createdReviews,
      count: createdReviews.length,
      success: true
    });
  } catch (error) {
    console.error('Error creating reviews:', error);
    return NextResponse.json(
      { error: 'Failed to create reviews', success: false },
      { status: 500 }
    );
  }
}
