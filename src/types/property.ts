export interface Property {
  id: string;
  name: string;
  location: string;
  rating?: number; // Calculated dynamically from approved reviews
  description: string;
  amenities: string[];
  images: string[];
  slug?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PropertyFilter {
  location?: string;
  minRating?: number;
  maxPrice?: number;
  amenities?: string[];
  limit?: number;
  skip?: number;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  hasMore: boolean;
}
