import { reviewRepository } from './repositories/ReviewRepository';
import { mockHostawayReviews } from '../hostaway/mockData';

export async function migrateMockData() {
  try {
    console.log('Starting data migration...');

    // Check if data already exists
    const existingCount = await reviewRepository.count();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} reviews. Adding more data for better analytics...`);
      // Continue to add more data for better month-over-month comparisons
    }

    console.log(`Migrating ${mockHostawayReviews.length} mock reviews to MongoDB...`);

    // Insert mock data in batches to avoid overwhelming the database
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < mockHostawayReviews.length; i += batchSize) {
      batches.push(mockHostawayReviews.slice(i, i + batchSize));
    }

    let totalInserted = 0;
    for (const batch of batches) {
      try {
        const inserted = await reviewRepository.bulkCreate(batch);
        totalInserted += inserted.length;
        console.log(`Inserted batch of ${inserted.length} reviews`);
      } catch (error) {
        console.error('Error inserting batch:', error);
        // Continue with next batch even if one fails
      }
    }

    console.log(`Migration completed! Successfully inserted ${totalInserted} reviews.`);

    // Verify the migration
    const finalCount = await reviewRepository.count();
    console.log(`Total reviews in database: ${finalCount}`);

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
