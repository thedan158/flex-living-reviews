import { Review, NormalizedReview } from '../../types/review';

export function normalizeReview(review: Review): NormalizedReview {
  // Calculate normalized rating from review categories or fallback to rating
  let normalizedRating = 0;

  if (review.reviewCategory && review.reviewCategory.length > 0) {
    // Calculate average rating from categories (Hostaway uses 1-10 scale, normalize to 0-5)
    const totalRating = review.reviewCategory.reduce((sum, cat) => sum + cat.rating, 0);
    normalizedRating = (totalRating / review.reviewCategory.length) / 2;
  } else if (review.rating !== null) {
    // Fallback to direct rating if available
    normalizedRating = review.rating;
    if (review.source === 'google' && review.rating > 5) {
      normalizedRating = review.rating / 2; // Google uses 1-10 scale
    }
  }

  // Content-based sentiment analysis (simple keyword matching)
  const comment = review.comment.toLowerCase();
  const positiveWords = ['amazing', 'excellent', 'fantastic', 'wonderful', 'perfect', 'outstanding', 'brilliant', 'superb', 'incredible', 'exceptional', 'love', 'loved', 'highly recommend', 'best', 'beautiful'];
  const negativeWords = ['disappointing', 'terrible', 'awful', 'horrible', 'worst', 'poor', 'bad', 'unacceptable', 'maintenance', 'broken', 'dirty', 'overpriced', 'not worth'];

  const positiveCount = positiveWords.filter(word => comment.includes(word)).length;
  const negativeCount = negativeWords.filter(word => comment.includes(word)).length;

  // Determine sentiment based on rating and content analysis
  let sentiment: 'positive' | 'neutral' | 'negative';

  // First check for mixed sentiments (both positive and negative keywords)
  if (positiveCount > 0 && negativeCount > 0) {
    sentiment = 'neutral';
  }
  // Then check rating-based sentiment
  else if (normalizedRating >= 4) {
    sentiment = positiveCount > 0 ? 'positive' : 'neutral';
  } else if (normalizedRating >= 3) {
    sentiment = negativeCount > 0 ? 'negative' : 'neutral';
  } else {
    sentiment = 'negative';
  }

  return {
    id: review.id,
    listingId: review.listingId || '',
    rating: review.rating || 0,
    comment: review.comment,
    guestName: review.guestName,
    date: review.date,
    reviewType: review.reviewType,
    channel: review.channel,
    source: review.source,
    normalizedRating,
    sentiment,
    reviewCategory: review.reviewCategory,
  };
}

export function normalizeReviews(reviews: Review[]): NormalizedReview[] {
  return reviews.map(normalizeReview);
}

export function groupReviewsByListing(reviews: NormalizedReview[]): Record<string, NormalizedReview[]> {
  return reviews.reduce((acc, review) => {
    if (!acc[review.listingId]) {
      acc[review.listingId] = [];
    }
    acc[review.listingId].push(review);
    return acc;
  }, {} as Record<string, NormalizedReview[]>);
}

export function groupReviewsByType(reviews: NormalizedReview[]): Record<string, NormalizedReview[]> {
  return reviews.reduce((acc, review) => {
    if (!acc[review.reviewType]) {
      acc[review.reviewType] = [];
    }
    acc[review.reviewType].push(review);
    return acc;
  }, {} as Record<string, NormalizedReview[]>);
}

export function groupReviewsByChannel(reviews: NormalizedReview[]): Record<string, NormalizedReview[]> {
  return reviews.reduce((acc, review) => {
    if (!acc[review.channel]) {
      acc[review.channel] = [];
    }
    acc[review.channel].push(review);
    return acc;
  }, {} as Record<string, NormalizedReview[]>);
}

export function groupReviewsByDate(reviews: NormalizedReview[]): Record<string, NormalizedReview[]> {
  return reviews.reduce((acc, review) => {
    const date = review.date.split('T')[0]; // Get date part only
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(review);
    return acc;
  }, {} as Record<string, NormalizedReview[]>);
}
