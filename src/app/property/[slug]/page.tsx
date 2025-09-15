'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LoadingOverlay from '../../../components/LoadingOverlay';

interface Property {
  id: number;
  name: string;
  location: string;
  rating?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
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

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        // Fetch property details
        const propertyRes = await fetch(`/api/properties/${slug}`);
        const propertyData = await propertyRes.json();
        setProperty(propertyData.property);

        // Fetch all reviews
        const reviewsRes = await fetch('/api/reviews');
        const reviewsData = await reviewsRes.json();

        // Filter reviews for this property and only approved ones
        const propertyReviews = reviewsData.reviews.filter(
          (review: Review) => review.listingId === slug && review.approved
        );
        setApprovedReviews(propertyReviews);
        setReviews(reviewsData.reviews);

        // Calculate average rating from normalized ratings of approved reviews
        if (propertyReviews.length > 0) {
          const averageRating = propertyReviews.reduce((sum: number, review: Review) =>
            sum + (review.normalizedRating || review.rating), 0
          ) / propertyReviews.length;
          setProperty(prev => prev ? { ...prev, rating: Math.round(averageRating * 10) / 10 } : null);
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPropertyData();
    }
  }, [slug]);

  if (!property && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Property not found</div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Property Header */}
      <div className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-3 tracking-tight">{property.name}</h1>
              <p className="text-xl text-stone-600 flex items-center">
                <svg className="w-6 h-6 mr-3 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {property.location}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="flex items-center mr-6">
                  <span className="text-amber-500 text-2xl mr-2">★</span>
                  <span className="text-xl font-semibold text-stone-900">{property.rating}</span>
                  <span className="text-stone-500 ml-2">({approvedReviews.length} reviews)</span>
                </div>
              </div>
              <button className="bg-[#4A5D5A] hover:bg-[#3A4D4A] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Images Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Main large image */}
          <div className="lg:col-span-2 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
                alt={`${property.name} - Main view`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex items-center justify-center">
                <svg className="w-20 h-20 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {/* Smaller images */}
          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
            {property.images && property.images.length > 1 ? (
              <img
                src={property.images[1]}
                alt={`${property.name} - Living area`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
            {property.images && property.images.length > 2 ? (
              <img
                src={property.images[2]}
                alt={`${property.name} - Kitchen`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-10 mb-10">
              <h2 className="text-3xl font-bold text-stone-900 mb-6 tracking-tight">About this property</h2>
              <p className="text-stone-700 leading-relaxed text-lg mb-8">
                {property.description || 'This is a beautiful property located in a prime area. It offers modern amenities and comfortable living spaces perfect for your stay.'}
              </p>

              {property.amenities && (
                <div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-6">Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center bg-stone-50 rounded-xl p-4 hover:bg-[#4A5D5A]/5 transition-colors duration-200">
                        <div className="w-6 h-6 bg-[#4A5D5A] rounded-full flex items-center justify-center mr-4">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-stone-700 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 mb-3 tracking-tight">Guest Reviews</h2>
                  <p className="text-stone-600 text-lg">What our guests say about their stay</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-4xl font-bold text-stone-900 mr-3">{property.rating}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < Math.floor(property.rating || 0) ? 'text-amber-500' : 'text-stone-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-500 mt-2 text-sm">{approvedReviews.length} verified reviews</p>
                </div>
              </div>

              {approvedReviews.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-20 h-20 mx-auto mb-6 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-stone-500 text-xl font-medium">No reviews available yet.</p>
                  <p className="text-stone-400 text-base mt-2">Be the first to leave a review after your stay!</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {approvedReviews.map((review) => (
                    <div key={review.id} className="border-b border-stone-100 pb-10 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#4A5D5A] to-[#3A4D4A] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {review.guestName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 text-lg">{review.guestName}</p>
                            <p className="text-stone-500 text-sm">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-stone-50 px-4 py-2 rounded-full border border-stone-200">
                          <div className="flex items-center mr-3">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-base ${i < (review.normalizedRating || review.rating) ? 'text-amber-500' : 'text-stone-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="font-semibold text-stone-700">{(review.normalizedRating || review.rating)}/5</span>
                        </div>
                      </div>
                      <p className="text-stone-700 leading-relaxed text-base mb-4">{review.comment}</p>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#4A5D5A]/10 text-[#4A5D5A] border border-[#4A5D5A]/20">
                          {review.channel}
                        </span>
                        <span className="text-stone-500 text-sm">via {review.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-6 tracking-tight">Book this property</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">Experience the comfort and serenity of this beautiful property. Contact us to secure your perfect stay.</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <span className="text-stone-600">Rating</span>
                  <div className="flex items-center">
                    <span className="text-amber-500 mr-1">★</span>
                    <span className="font-semibold text-stone-900">{property.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <span className="text-stone-600">Location</span>
                  <span className="font-medium text-stone-900">{property.location}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-stone-600">Reviews</span>
                  <span className="font-medium text-stone-900">{approvedReviews.length}</span>
                </div>
              </div>

              <button className="w-full bg-[#4A5D5A] hover:bg-[#3A4D4A] text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
                Contact Host
              </button>

              <div className="mt-6 text-center">
                <p className="text-stone-500 text-sm">Need help booking?</p>
                <p className="text-[#4A5D5A] font-medium mt-1">We're here to assist you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={loading}
        message="Loading property details from MongoDB..."
      />
    </div>
  );
}
