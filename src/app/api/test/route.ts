import { NextResponse } from 'next/server';
import { reviewRepository } from '../../../lib/services/database/repositories/ReviewRepository';
import { mockHostawayReviews } from '../../../lib/services/hostaway/mockData';

export async function GET() {
  try {
    const results = {
      connection: 'Testing database operations...',
      tests: [] as any[]
    };

    // Test 1: Count existing reviews
    try {
      const count = await reviewRepository.count();
      results.tests.push({
        test: 'Count reviews',
        status: 'success',
        result: count
      });
    } catch (error) {
      results.tests.push({
        test: 'Count reviews',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Create a test review
    try {
      const testReview = {
        id: `test-${Date.now()}`,
        listingId: 'test-1',
        rating: 5,
        comment: 'Test review for MongoDB integration',
        guestName: 'Test User',
        date: new Date().toISOString(),
        reviewType: 'guest-to-host' as const,
        channel: 'hostaway' as const,
        source: 'test',
        approved: true,
        status: 'published' as const,
        reviewCategory: [
          { category: 'cleanliness', rating: 5 },
          { category: 'communication', rating: 5 }
        ],
        listingName: 'Test Property'
      };

      const created = await reviewRepository.create(testReview);
      results.tests.push({
        test: 'Create review',
        status: 'success',
        result: { id: created.id, approved: created.approved }
      });
    } catch (error) {
      results.tests.push({
        test: 'Create review',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Find the created review
    try {
      const reviews = await reviewRepository.findAll({ limit: 5 });
      results.tests.push({
        test: 'Find reviews',
        status: 'success',
        result: { count: reviews.length, firstReview: reviews[0]?.id }
      });
    } catch (error) {
      results.tests.push({
        test: 'Find reviews',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Test approval functionality
    try {
      const testId = `test-${Date.now()}`;
      const approvalStatus = await reviewRepository.getApprovalStatus(testId);
      results.tests.push({
        test: 'Get approval status',
        status: 'success',
        result: approvalStatus
      });
    } catch (error) {
      results.tests.push({
        test: 'Get approval status',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database tests completed',
      results
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Test bulk create with a few mock reviews
    const testReviews = mockHostawayReviews.slice(0, 3).map(review => ({
      ...review,
      id: `${review.id}-test-${Date.now()}`
    }));

    const created = await reviewRepository.bulkCreate(testReviews);

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} test reviews`,
      reviews: created.map(r => ({ id: r.id, approved: r.approved }))
    });
  } catch (error) {
    console.error('Bulk create test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Bulk create test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
