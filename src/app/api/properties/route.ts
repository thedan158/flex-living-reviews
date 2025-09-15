import { NextResponse } from 'next/server';

export async function GET() {
  // Mock properties - expanded to include all properties with reviews
  const mockProperties = [
    {
      id: 1,
      name: 'Luxury Downtown Apartment',
      location: 'Downtown Bangkok',
      rating: 4.5,
      description: 'A stunning luxury apartment in the heart of Bangkok\'s bustling downtown district. This modern property features floor-to-ceiling windows with panoramic city views, high-end finishes, and premium amenities.',
      amenities: [
        'WiFi',
        'Air conditioning',
        'Kitchen',
        'Washer',
        'Dryer',
        'Elevator',
        'Gym access',
        'Swimming pool',
        'Concierge service',
        'Parking'
      ],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ]
    },
    {
      id: 2,
      name: 'Cozy Studio in Midtown',
      location: 'Midtown Bangkok',
      rating: 4.2,
      description: 'A charming studio apartment perfect for solo travelers or couples. Located in a quiet midtown neighborhood with easy access to public transportation and local attractions.',
      amenities: [
        'WiFi',
        'Air conditioning',
        'Kitchenette',
        'Coffee maker',
        'Smart TV',
        'Workspace',
        'Laundry facilities',
        'Security system'
      ],
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ]
    },
    {
      id: 3,
      name: 'Modern City Loft',
      location: 'Central Bangkok',
      rating: 4.7,
      description: 'An exquisite modern loft in the heart of Bangkok, featuring industrial-chic design with exposed brick walls, high ceilings, and state-of-the-art amenities perfect for urban living.',
      amenities: [
        'WiFi',
        'Air conditioning',
        'Fully equipped kitchen',
        'In-unit washer/dryer',
        'Rooftop access',
        'Gym membership',
        '24/7 security',
        'Parking',
        'Concierge',
        'City views'
      ],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ]
    }
  ];

  return NextResponse.json({ properties: mockProperties });
}
