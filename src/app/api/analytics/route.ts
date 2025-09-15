import { NextResponse } from 'next/server';
import { mockHostawayReviews } from '../../../lib/services/hostaway/mockData';

export async function GET() {
  // Calculate analytics from actual mock data
  const allReviews = mockHostawayReviews;

  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0
    ? allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
    : 0;

  const reviewsBySource = {
    hostaway: allReviews.filter(r => r.source === 'hostaway').length,
    google: allReviews.filter(r => r.source === 'google').length,
  };

  // Calculate monthly trends from 2025
  const monthlyTrends = [
    { month: 'Jan', reviews: allReviews.filter(r => r.date.includes('2025-01')).length },
    { month: 'Feb', reviews: allReviews.filter(r => r.date.includes('2025-02')).length },
    { month: 'Mar', reviews: allReviews.filter(r => r.date.includes('2025-03')).length },
    { month: 'Apr', reviews: allReviews.filter(r => r.date.includes('2025-04')).length },
    { month: 'May', reviews: allReviews.filter(r => r.date.includes('2025-05')).length },
    { month: 'Jun', reviews: allReviews.filter(r => r.date.includes('2025-06')).length },
    { month: 'Jul', reviews: allReviews.filter(r => r.date.includes('2025-07')).length },
    { month: 'Aug', reviews: allReviews.filter(r => r.date.includes('2025-08')).length },
    { month: 'Sep', reviews: allReviews.filter(r => r.date.includes('2025-09')).length },
  ];

  const mockAnalytics = {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    reviewsBySource,
    monthlyTrends,
  };

  return NextResponse.json(mockAnalytics);
}
