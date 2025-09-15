import { NextResponse } from 'next/server';
import { mockHostawayReviews } from '../../../../lib/services/hostaway/mockData';
import { hostawayApi } from '../../../../lib/services/hostaway/api';
import { normalizeReviews, groupReviewsByListing, groupReviewsByType, groupReviewsByChannel, groupReviewsByDate } from '../../../../lib/utils/reviewNormalizer';

// Transform Hostaway API response to our Review format
function transformHostawayResponse(apiResponse: any): any[] {
  if (!apiResponse.result || !Array.isArray(apiResponse.result)) {
    return [];
  }

  return apiResponse.result.map((item: any) => ({
    id: item.id?.toString() || '',
    listingId: item.listingId?.toString(),
    rating: item.rating || null,
    comment: item.publicReview || '',
    guestName: item.guestName || '',
    date: item.submittedAt || '',
    reviewType: item.type || 'guest-to-host',
    channel: 'hostaway',
    source: 'hostaway',
    status: item.status || 'published',
    reviewCategory: item.reviewCategory || [],
    listingName: item.listingName || '',
    approved: item.status === 'published',
  }));
}

export async function GET(request: Request) {
  try {
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get('groupBy'); // 'listing', 'type', 'channel', 'date'
    const useMock = searchParams.get('mock') === 'true'; // Allow switching to mock data for testing

    let reviews;

    if (useMock) {
      // Use mock data for testing
      reviews = mockHostawayReviews;
    } else {
      // Try to fetch real data from Hostaway API, fallback to mock on failure
      try {
        const apiResponse = await hostawayApi.getAllReviews();
        reviews = transformHostawayResponse(apiResponse);
      } catch (apiError) {
        console.error('Hostaway API error, falling back to mock data:', apiError);
        reviews = mockHostawayReviews;
      }
    }

    // Normalize the reviews
    const normalizedReviews = normalizeReviews(reviews);

    let responseData;

    switch (groupBy) {
      case 'listing':
        responseData = {
          groupedBy: 'listing',
          data: groupReviewsByListing(normalizedReviews),
          total: normalizedReviews.length,
        };
        break;
      case 'type':
        responseData = {
          groupedBy: 'type',
          data: groupReviewsByType(normalizedReviews),
          total: normalizedReviews.length,
        };
        break;
      case 'channel':
        responseData = {
          groupedBy: 'channel',
          data: groupReviewsByChannel(normalizedReviews),
          total: normalizedReviews.length,
        };
        break;
      case 'date':
        responseData = {
          groupedBy: 'date',
          data: groupReviewsByDate(normalizedReviews),
          total: normalizedReviews.length,
        };
        break;
      default:
        responseData = {
          reviews: normalizedReviews,
          total: normalizedReviews.length,
          summary: {
            averageRating: normalizedReviews.length > 0
              ? normalizedReviews.reduce((sum: number, r) => sum + r.normalizedRating, 0) / normalizedReviews.length
              : 0,
            totalReviews: normalizedReviews.length,
            positiveReviews: normalizedReviews.filter((r) => r.sentiment === 'positive').length,
            neutralReviews: normalizedReviews.filter((r) => r.sentiment === 'neutral').length,
            negativeReviews: normalizedReviews.filter((r) => r.sentiment === 'negative').length,
          },
        };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error processing Hostaway reviews:', error);
    return NextResponse.json(
      { error: 'Failed to process reviews' },
      { status: 500 }
    );
  }
}
