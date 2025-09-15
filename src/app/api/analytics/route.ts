import { NextResponse } from 'next/server';
import { reviewRepository } from '../../../lib/services/database/repositories/ReviewRepository';

export async function GET() {
  try {
    // Fetch all reviews from MongoDB
    const allReviews = await reviewRepository.findAll();

  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0
    ? allReviews.reduce((sum, review) => sum + (review.normalizedRating || review.rating || 0), 0) / totalReviews
    : 0;

  const reviewsBySource = {
    hostaway: allReviews.filter(r => r.source?.toLowerCase().includes('hostaway')).length,
    google: allReviews.filter(r => r.source?.toLowerCase().includes('google')).length,
  };

  // Calculate monthly trends - handle different date formats
  const monthlyTrends = [
    { month: 'Jan', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 0 && date.getFullYear() === 2025;
    }).length },
    { month: 'Feb', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 1 && date.getFullYear() === 2025;
    }).length },
    { month: 'Mar', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 2 && date.getFullYear() === 2025;
    }).length },
    { month: 'Apr', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 3 && date.getFullYear() === 2025;
    }).length },
    { month: 'May', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 4 && date.getFullYear() === 2025;
    }).length },
    { month: 'Jun', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 5 && date.getFullYear() === 2025;
    }).length },
    { month: 'Jul', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 6 && date.getFullYear() === 2025;
    }).length },
    { month: 'Aug', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 7 && date.getFullYear() === 2025;
    }).length },
    { month: 'Sep', reviews: allReviews.filter(r => {
      const date = new Date(r.date);
      return !isNaN(date.getTime()) && date.getMonth() === 8 && date.getFullYear() === 2025;
    }).length },
  ];

    const analytics = {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewsBySource,
      monthlyTrends,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
