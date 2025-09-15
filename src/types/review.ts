export interface Review {
  id: string;
  listingId?: string;
  rating: number | null;
  comment: string;
  guestName: string;
  date: string;
  reviewType: 'host-to-guest' | 'guest-to-host' | 'automatic';
  channel: 'hostaway' | 'airbnb' | 'booking' | 'direct';
  source: string;
  normalizedRating?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  approved?: boolean;
  status?: 'published' | 'pending' | 'rejected';
  reviewCategory?: Array<{
    category: string;
    rating: number;
  }>;
  listingName?: string;
}

export interface NormalizedReview {
  id: string;
  listingId: string;
  rating: number;
  comment: string;
  guestName: string;
  date: string;
  reviewType: string;
  channel: string;
  source: string;
  normalizedRating: number;
  sentiment: string;
  reviewCategory?: Array<{
    category: string;
    rating: number;
  }>;
}
