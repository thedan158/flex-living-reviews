'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');

  const city = searchParams.get('city');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  useEffect(() => {
    // Simulate API call to fetch properties
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // Generate dynamic mock data based on search criteria
        const generateMockProperties = (searchCity: string | null, guestCount: string | null): Property[] => {
          const cities = {
            'Bangkok': {
              name: 'Bangkok',
              country: 'Thailand',
              basePrice: 80,
              currency: 'THB',
              properties: [
                {
                  title: 'Sukhumvit Luxury Condo',
                  location: 'Sukhumvit, Bangkok',
                  price: 120,
                  rating: 4.8,
                  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Modern 1-bedroom condo in the heart of Bangkok\'s business district with stunning city views, fully equipped kitchen, and 24/7 security.'
                },
                {
                  title: 'Riverside Boutique Apartment',
                  location: 'Charoenkrung, Bangkok',
                  price: 95,
                  rating: 4.6,
                  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Charming apartment overlooking the Chao Phraya River with traditional Thai architecture and modern amenities.'
                },
                {
                  title: 'Silom Business District Loft',
                  location: 'Silom, Bangkok',
                  price: 110,
                  rating: 4.7,
                  image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Industrial-style loft in Bangkok\'s financial district, perfect for business travelers with high-speed internet and workspace.'
                },
                {
                  title: 'Traditional Thai House',
                  location: 'Old Town, Bangkok',
                  price: 75,
                  rating: 4.5,
                  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Authentic Thai wooden house in Bangkok\'s historic district with garden and traditional decor.'
                },
                {
                  title: 'Skyline Penthouse',
                  location: 'Bangkok CBD',
                  price: 250,
                  rating: 4.9,
                  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Luxurious penthouse with panoramic Bangkok skyline views, private terrace, and premium finishes.'
                },
                {
                  title: 'Boutique Hotel Suite',
                  location: 'Siam Square, Bangkok',
                  price: 140,
                  rating: 4.8,
                  image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Elegant suite in a boutique hotel near shopping centers with spa access and room service.'
                },
                {
                  title: 'Garden Villa Resort',
                  location: 'Bangkok Suburbs',
                  price: 180,
                  rating: 4.7,
                  image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Spacious villa with private garden and pool, just 20 minutes from Bangkok city center.'
                },
                {
                  title: 'Modern Studio Apartment',
                  location: 'Asok, Bangkok',
                  price: 85,
                  rating: 4.4,
                  image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Compact but stylish studio perfect for solo travelers, with gym access and convenient BTS station nearby.'
                }
              ]
            },
            'London': {
              name: 'London',
              country: 'United Kingdom',
              basePrice: 120,
              currency: 'GBP',
              properties: [
                {
                  title: 'Notting Hill Victorian House',
                  location: 'Notting Hill, London',
                  price: 180,
                  rating: 4.8,
                  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Beautiful Victorian terraced house in trendy Notting Hill with period features and modern updates.'
                },
                {
                  title: 'Shoreditch Loft Apartment',
                  location: 'Shoreditch, London',
                  price: 160,
                  rating: 4.7,
                  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Contemporary loft in the heart of Shoreditch\'s tech district with exposed brick and industrial design.'
                },
                {
                  title: 'Kensington Garden Flat',
                  location: 'Kensington, London',
                  price: 220,
                  rating: 4.9,
                  image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Elegant garden flat near Kensington Palace with private entrance and beautifully landscaped garden.'
                },
                {
                  title: 'Camden Town Houseboat',
                  location: 'Camden, London',
                  price: 140,
                  rating: 4.6,
                  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Unique houseboat on Regent\'s Canal with bohemian charm and vibrant Camden Market nearby.'
                },
                {
                  title: 'Mayfair Luxury Suite',
                  location: 'Mayfair, London',
                  price: 350,
                  rating: 4.9,
                  image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Opulent suite in London\'s most prestigious district with butler service and world-class amenities.'
                },
                {
                  title: 'Brixton Creative Space',
                  location: 'Brixton, London',
                  price: 95,
                  rating: 4.5,
                  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Artistic apartment in vibrant Brixton with street art views and creative neighborhood atmosphere.'
                },
                {
                  title: 'Chelsea Townhouse',
                  location: 'Chelsea, London',
                  price: 280,
                  rating: 4.8,
                  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Stunning Georgian townhouse in fashionable Chelsea with original features and modern luxury.'
                },
                {
                  title: 'Hackney Warehouse Conversion',
                  location: 'Hackney, London',
                  price: 130,
                  rating: 4.6,
                  image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Converted warehouse space in trendy Hackney with high ceilings, exposed beams, and urban edge.'
                }
              ]
            },
            'Paris': {
              name: 'Paris',
              country: 'France',
              basePrice: 100,
              currency: 'EUR',
              properties: [
                {
                  title: 'Le Marais Haussmannian Apartment',
                  location: 'Le Marais, Paris',
                  price: 160,
                  rating: 4.8,
                  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Elegant Haussmannian apartment in the heart of Le Marais with original moldings and modern kitchen.'
                },
                {
                  title: 'Montmartre Artist\'s Studio',
                  location: 'Montmartre, Paris',
                  price: 120,
                  rating: 4.7,
                  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Charming artist\'s studio in bohemian Montmartre with views of Sacré-Cœur and creative atmosphere.'
                },
                {
                  title: 'Saint-Germain Luxury Loft',
                  location: 'Saint-Germain-des-Prés, Paris',
                  price: 240,
                  rating: 4.9,
                  image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Contemporary loft in literary Saint-Germain with floor-to-ceiling windows and designer furnishings.'
                },
                {
                  title: 'Latin Quarter Student Housing',
                  location: 'Latin Quarter, Paris',
                  price: 85,
                  rating: 4.4,
                  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Cozy apartment near Sorbonne University with classic Parisian architecture and neighborhood charm.'
                },
                {
                  title: 'Champs-Élysées Penthouse',
                  location: 'Champs-Élysées, Paris',
                  price: 400,
                  rating: 4.9,
                  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Spectacular penthouse overlooking the Champs-Élysées with private terrace and concierge service.'
                },
                {
                  title: 'Bastille Design Hotel Room',
                  location: 'Bastille, Paris',
                  price: 140,
                  rating: 4.6,
                  image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Designer room in a boutique hotel near Place de la Bastille with contemporary art and local vibe.'
                },
                {
                  title: 'Belleville Trendy Apartment',
                  location: 'Belleville, Paris',
                  price: 110,
                  rating: 4.5,
                  image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Stylish apartment in up-and-coming Belleville district with multicultural atmosphere and great food scene.'
                },
                {
                  title: 'Île Saint-Louis Historic Flat',
                  location: 'Île Saint-Louis, Paris',
                  price: 190,
                  rating: 4.7,
                  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Historic flat on the Île Saint-Louis with Seine River views and authentic Parisian character.'
                }
              ]
            },
            'Algiers': {
              name: 'Algiers',
              country: 'Algeria',
              basePrice: 60,
              currency: 'DZD',
              properties: [
                {
                  title: 'Casbah Traditional Riad',
                  location: 'Casbah, Algiers',
                  price: 80,
                  rating: 4.6,
                  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Traditional riad in the historic Casbah district with Moorish architecture and Mediterranean views.'
                },
                {
                  title: 'Hydra Modern Apartment',
                  location: 'Hydra, Algiers',
                  price: 95,
                  rating: 4.7,
                  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Contemporary apartment in upscale Hydra district with modern amenities and sea views.'
                },
                {
                  title: 'El Mouradia Diplomatic Quarter',
                  location: 'El Mouradia, Algiers',
                  price: 120,
                  rating: 4.8,
                  image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Elegant residence in Algiers\' diplomatic quarter with gardens and premium security.'
                },
                {
                  title: 'Bab El Oued Coastal Villa',
                  location: 'Bab El Oued, Algiers',
                  price: 150,
                  rating: 4.5,
                  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Mediterranean villa with sea views and traditional Algerian architectural elements.'
                },
                {
                  title: 'Centre Ville Business Hotel',
                  location: 'Centre Ville, Algiers',
                  price: 110,
                  rating: 4.6,
                  image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Modern hotel room in Algiers city center with business amenities and proximity to attractions.'
                },
                {
                  title: 'Zéralda Beach Resort',
                  location: 'Zéralda, Algiers',
                  price: 130,
                  rating: 4.7,
                  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Beachfront resort near Algiers with pools, restaurants, and Mediterranean climate.'
                },
                {
                  title: 'Bouzareah Mountain View',
                  location: 'Bouzareah, Algiers',
                  price: 75,
                  rating: 4.4,
                  image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Mountain-view apartment in Bouzareah with cooler climate and panoramic city vistas.'
                },
                {
                  title: 'Staouéli Resort Complex',
                  location: 'Staouéli, Algiers',
                  price: 160,
                  rating: 4.8,
                  image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  description: 'Luxury resort complex near Algiers with golf course, spa, and fine dining.'
                }
              ]
            }
          };

          const selectedCity = searchCity && cities[searchCity as keyof typeof cities] ? cities[searchCity as keyof typeof cities] : cities['Bangkok'];
          const guestMultiplier = guestCount ? Math.max(1, parseInt(guestCount) * 0.1) : 1;

          return selectedCity.properties.map((prop, index) => ({
            id: `${selectedCity.name.toLowerCase()}-${index + 1}`,
            title: prop.title,
            location: prop.location,
            price: Math.round(prop.price * guestMultiplier),
            rating: prop.rating,
            image: prop.image,
            description: prop.description
          }));
        };

        const mockProperties = generateMockProperties(city, guests);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Sort properties based on selected criteria
        let sortedProperties = [...mockProperties];
        if (sortBy === 'price-low') {
          sortedProperties.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          sortedProperties.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          sortedProperties.sort((a, b) => b.rating - a.rating);
        }

        setProperties(sortedProperties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [city, sortBy, guests]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="pt-20 pb-16 bg-gradient-to-br from-light-gray via-white to-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-text-light">Searching for properties...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')`
          }}
          role="img"
          aria-label="Beautiful bedroom interior with natural lighting"
        ></div>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-heading font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Find Your Perfect Stay
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Search through our curated collection of beautiful properties in {city || 'your destination'}.
            </p>

            {/* Search Form */}
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-text-dark mb-2">Search Results</h2>
              <p className="text-text-light">
                {properties.length} properties found
                {city && <span> in {city}</span>}
                {checkIn && checkOut && (
                  <span> • {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}</span>
                )}
                {guests && <span> • {guests} guests</span>}
              </p>
            </div>

            {/* Sort Options */}
            <div className="mt-4 sm:mt-0">
              <label htmlFor="sort" className="block text-sm font-medium text-text-dark mb-2 sm:mb-0 sm:mr-3">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className="bg-light-gray rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 block"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center">
                      <span className="text-amber-500 text-sm mr-1" aria-hidden="true">★</span>
                      <span className="text-text-dark font-semibold text-sm">{property.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-dark mb-2">{property.title}</h3>
                  <p className="text-text-light mb-2">{property.location}</p>
                  <p className="text-text-light text-sm mb-4">{property.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">From £{property.price}/night</span>
                    <span className="text-primary font-medium">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">No properties found</h3>
              <p className="text-text-light mb-6">Try adjusting your search criteria or exploring different dates.</p>
              <Link
                href="/"
                className="bg-primary hover:bg-secondary-teal text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Start New Search
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <div className="pt-20 pb-16 bg-gradient-to-br from-light-gray via-white to-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-text-light">Loading search results...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
