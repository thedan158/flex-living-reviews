'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingOverlay from '../../components/LoadingOverlay';

interface Property {
  id: number;
  name: string;
  location: string;
  rating?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  reviewCount?: number;
}

interface Review {
  id: string;
  listingId: string;
  rating: number;
  comment: string;
  guestName: string;
  date: string;
  reviewType: string;
  channel: string;
  source: string;
  normalizedRating?: number;
  sentiment?: string;
  approved?: boolean;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all properties
        const propertiesRes = await fetch('/api/properties');
        const propertiesData = await propertiesRes.json();

        // Fetch all reviews
        const reviewsRes = await fetch('/api/reviews');
        const reviewsData = await reviewsRes.json();

        // Filter properties that have approved reviews
        const approvedReviews = reviewsData.reviews.filter((review: Review) => review.approved);
        const propertyIdsWithApprovedReviews = [...new Set(approvedReviews.map((review: Review) => review.listingId))];

        // Add review count and calculate rating from approved reviews
        const propertiesWithReviewCount = propertiesData.properties.map((property: Property) => {
          const propertyReviews = approvedReviews.filter((review: Review) => review.listingId === property.id.toString());
          const reviewCount = propertyReviews.length;
          const averageRating = reviewCount > 0
            ? propertyReviews.reduce((sum: number, review: Review) =>
                sum + (review.normalizedRating || review.rating), 0
              ) / reviewCount
            : 0;

          return {
            ...property,
            reviewCount,
            rating: reviewCount > 0 ? Math.round(averageRating * 10) / 10 : undefined
          };
        });

        // Filter to only show properties with approved reviews
        const filteredProperties = propertiesWithReviewCount.filter((property: Property) =>
          propertyIdsWithApprovedReviews.includes(property.id.toString())
        );

        setProperties(filteredProperties);
        setReviews(reviewsData.reviews);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4 tracking-tight">Our Properties</h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Discover our collection of premium properties, each carefully selected and verified through guest reviews.
            </p>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto mb-6 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-stone-500 text-xl font-medium">No properties available at the moment.</p>
            <p className="text-stone-400 text-base mt-2">Please check back later for new listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className="group bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Property Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#4A5D5A]/90 text-white backdrop-blur-sm">
                      {property.location}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-80">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-[#4A5D5A] transition-colors duration-200">
                    {property.name}
                  </h3>

                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                    {property.description || 'A beautiful property offering comfort and convenience in a prime location.'}
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-amber-500 text-lg mr-1">★</span>
                      <span className="font-semibold text-stone-900 mr-2">{property.rating}</span>
                      <span className="text-stone-500 text-sm">
                        ({property.reviewCount || 0} review{(property.reviewCount || 0) !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>

                  {/* Amenities Preview */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-700"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-700">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A5D5A] font-semibold group-hover:underline">
                      View Details →
                    </span>
                    <div className="w-8 h-8 bg-[#4A5D5A] rounded-full flex items-center justify-center group-hover:bg-[#3A4D4A] transition-colors duration-200">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-[#4A5D5A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8 text-stone-200">
            Contact us today to secure your perfect accommodation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-[#4A5D5A] font-semibold rounded-lg hover:bg-stone-100 transition-colors duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={loading}
        message="Loading properties from MongoDB..."
      />
    </div>
  );
}
