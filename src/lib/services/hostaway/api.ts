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
      console.warn('Hostaway API credentials not configured, using mock data');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    // If credentials are not configured, throw error to trigger fallback to mock data
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
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (listingId) {
      params.append('listingId', listingId);
    }

    const endpoint = `/reviews?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  async getAllReviews(): Promise<any> {
    // Hostaway API might require pagination, so we'll fetch all reviews
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
  }
}

export const hostawayApi = new HostawayApiService();
