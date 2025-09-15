import { NextResponse } from 'next/server';

export async function GET() {
  // Mock Google reviews
  const mockGoogleReviews = [
    {
      id: 1,
      rating: 5,
      comment: 'Amazing location!',
      authorName: 'Alice Johnson',
      date: '2023-01-02',
    },
    {
      id: 2,
      rating: 4,
      comment: 'Clean and modern',
      authorName: 'Bob Wilson',
      date: '2023-01-04',
    },
  ];

  return NextResponse.json({ reviews: mockGoogleReviews });
}
