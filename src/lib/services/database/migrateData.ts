import { reviewRepository } from './repositories/ReviewRepository';
import { propertiesRepository } from './repositories/PropertiesRepository';
import { mockHostawayReviews } from '../hostaway/mockData';

// Mock properties data - IDs match existing reviews (listingId values)
// Note: rating is calculated dynamically from approved reviews
const mockProperties = [
  {
    id: '1',
    name: 'Luxury Downtown Apartment',
    location: 'Downtown Bangkok',
    description: 'A stunning luxury apartment in the heart of Bangkok\'s bustling downtown district. This modern property features floor-to-ceiling windows with panoramic city views, high-end finishes, and premium amenities.',
    slug: 'luxury-downtown-apartment',
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
    id: '2',
    name: 'Cozy Studio in Midtown',
    location: 'Midtown Bangkok',
    description: 'A charming studio apartment perfect for solo travelers or couples. Located in a quiet midtown neighborhood with easy access to public transportation and local attractions.',
    slug: 'cozy-studio-midtown',
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
    id: '3',
    name: 'Modern City Loft',
    location: 'Central Bangkok',
    description: 'An exquisite modern loft in the heart of Bangkok, featuring industrial-chic design with exposed brick walls, high ceilings, and state-of-the-art amenities perfect for urban living.',
    slug: 'modern-city-loft',
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

export async function migrateMockData() {
  try {
    console.log('Starting data migration...');

    // Migrate reviews
    console.log('Checking reviews data...');
    const existingReviewCount = await reviewRepository.count();
    if (existingReviewCount > 0) {
      console.log(`Database already contains ${existingReviewCount} reviews. Adding more data for better analytics...`);
    }

    console.log(`Migrating ${mockHostawayReviews.length} mock reviews to MongoDB...`);

    // Insert review data in batches to avoid overwhelming the database
    const batchSize = 10;
    const reviewBatches = [];

    for (let i = 0; i < mockHostawayReviews.length; i += batchSize) {
      reviewBatches.push(mockHostawayReviews.slice(i, i + batchSize));
    }

    let totalReviewsInserted = 0;
    for (const batch of reviewBatches) {
      try {
        const inserted = await reviewRepository.bulkCreate(batch);
        totalReviewsInserted += inserted.length;
        console.log(`Inserted batch of ${inserted.length} reviews`);
      } catch (error) {
        console.error('Error inserting review batch:', error);
        // Continue with next batch even if one fails
      }
    }

    console.log(`Reviews migration completed! Successfully inserted ${totalReviewsInserted} reviews.`);

    // Migrate properties
    console.log('Checking properties data...');
    const existingPropertyCount = await propertiesRepository.count();
    if (existingPropertyCount > 0) {
      console.log(`Database already contains ${existingPropertyCount} properties. Updating property IDs to match reviews...`);

      // Update existing properties by their current IDs to have correct new IDs
      const idMapping = {
        'luxury-downtown-apartment': '1',
        'cozy-studio-midtown': '2',
        'modern-city-loft': '3'
      };

      for (const [oldId, newId] of Object.entries(idMapping)) {
        try {
          const propertyData = mockProperties.find(p => p.id === newId);
          if (propertyData) {
            // Find property by old ID and update with new data
            const existingProperty = await propertiesRepository.findById(oldId);
            if (existingProperty) {
              await propertiesRepository.updateById(oldId, { ...propertyData, id: newId });
              console.log(`Updated property ${oldId} to ID ${newId}`);
            }
          }
        } catch (error) {
          console.log(`Property ${oldId} update failed:`, error instanceof Error ? error.message : String(error));
        }
      }
      console.log('Properties updated successfully!');
    } else {
      console.log(`Migrating ${mockProperties.length} mock properties to MongoDB...`);

      try {
        const inserted = await propertiesRepository.bulkCreate(mockProperties);
        console.log(`Properties migration completed! Successfully inserted ${inserted.length} properties.`);
      } catch (error) {
        console.error('Error inserting properties:', error);
        throw error;
      }
    }

    // Verify the migrations
    const finalReviewCount = await reviewRepository.count();
    const finalPropertyCount = await propertiesRepository.count();
    console.log(`Migration completed! Total reviews: ${finalReviewCount}, Total properties: ${finalPropertyCount}`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Function to clear all data (useful for testing)
export async function clearAllData() {
  try {
    console.log('Clearing all review data...');
    // Note: This would require direct access to the model
    // For safety, we'll implement this differently in production
    console.log('Data clearing not implemented for safety reasons');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}
