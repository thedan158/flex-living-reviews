import { reviewRepository } from '../database/repositories/ReviewRepository';
import { Review } from '../../../types/review';

interface HostawayApiConfig {
  apiKey: string;
  accountId: string;
  baseUrl: string;
}

class HostawayApiService {
  private config: HostawayApiConfig;

  constructor() {
    this.config = {
      apiKey: process.env.HOSTAWAY_API_KEY || '',
      accountId: process.env.HOSTAWAY_ACCOUNT_ID || '',
      baseUrl: process.env.HOSTAWAY_BASE_URL || 'https://api.hostaway.com/v1',
    };

    if (!this.config.apiKey || !this.config.accountId) {
      console.warn('Hostaway API credentials not configured, using database data');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    // If credentials are not configured, throw error to trigger fallback to database
    if (!this.config.apiKey || !this.config.accountId) {
      throw new Error('Hostaway API credentials not configured');
    }

    const url = `${this.config.baseUrl}${endpoint}`;

    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Hostaway API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getReviews(listingId?: string, limit: number = 100, offset: number = 0): Promise<any> {
    try {
      // Try to use real API first
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (listingId) {
        params.append('listingId', listingId);
      }

      const endpoint = `/reviews?${params.toString()}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      // Fallback to database
      console.log('Falling back to database for reviews');
      return await this.getReviewsFromDatabase(listingId, limit, offset);
    }
  }

  async getAllReviews(): Promise<any> {
    try {
      // Try to use real API first
      const allReviews: any[] = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const response = await this.getReviews(undefined, limit, offset);

        if (!response.result || response.result.length === 0) {
          break;
        }

        allReviews.push(...response.result);
        offset += limit;

        // Safety check to prevent infinite loops
        if (offset > 10000) {
          console.warn('Reached maximum offset, stopping pagination');
          break;
        }
      }

      return {
        status: 'success',
        result: allReviews,
      };
    } catch (error) {
      // Fallback to database
      console.log('Falling back to database for all reviews');
      return await this.getAllReviewsFromDatabase();
    }
  }

  private async getReviewsFromDatabase(listingId?: string, limit: number = 100, skip: number = 0): Promise<any> {
    try {
      const reviews = await reviewRepository.findAll({
        listingId,
        channel: 'hostaway',
        limit,
        skip,
        sort: { date: -1 }
      });

      return {
        status: 'success',
        result: reviews.map(review => this.convertToApiFormat(review)),
      };
    } catch (error) {
      console.error('Error fetching reviews from database:', error);
      return {
        status: 'error',
        result: [],
      };
    }
  }

  private async getAllReviewsFromDatabase(): Promise<any> {
    try {
      const reviews = await reviewRepository.findAll({
        channel: 'hostaway',
        sort: { date: -1 }
      });

      return {
        status: 'success',
        result: reviews.map(review => this.convertToApiFormat(review)),
      };
    } catch (error) {
      console.error('Error fetching all reviews from database:', error);
      return {
        status: 'error',
        result: [],
      };
    }
  }

  private convertToApiFormat(review: any): any {
    return {
      id: review.id,
      listingId: review.listingId,
      rating: review.rating,
      comment: review.comment,
      guestName: review.guestName,
      date: review.date,
      reviewType: review.reviewType,
      channel: review.channel,
      source: review.source,
      normalizedRating: review.normalizedRating,
      sentiment: review.sentiment,
      approved: review.approved,
      status: review.status,
      reviewCategory: review.reviewCategory,
      listingName: review.listingName,
    };
  }

  // Database-specific methods
  async createReview(reviewData: Omit<Review, '_id'>): Promise<any> {
    try {
      const review = await reviewRepository.create(reviewData);
      return {
        status: 'success',
        result: this.convertToApiFormat(review),
      };
    } catch (error) {
      console.error('Error creating review:', error);
      return {
        status: 'error',
        message: 'Failed to create review',
      };
    }
  }

  async updateReview(id: string, updateData: Partial<Review>): Promise<any> {
    try {
      const review = await reviewRepository.updateById(id, updateData);
      if (review) {
        return {
          status: 'success',
          result: this.convertToApiFormat(review),
        };
      } else {
        return {
          status: 'error',
          message: 'Review not found',
        };
      }
    } catch (error) {
      console.error('Error updating review:', error);
      return {
        status: 'error',
        message: 'Failed to update review',
      };
    }
  }

  async deleteReview(id: string): Promise<any> {
    try {
      const deleted = await reviewRepository.deleteById(id);
      return {
        status: deleted ? 'success' : 'error',
        message: deleted ? 'Review deleted' : 'Review not found',
      };
    } catch (error) {
      console.error('Error deleting review:', error);
      return {
        status: 'error',
        message: 'Failed to delete review',
      };
    }
  }
}

export const hostawayApi = new HostawayApiService();
