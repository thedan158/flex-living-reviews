const { migrateMockData } = require('../src/lib/services/database/migrateData');

async function main() {
  try {
    console.log('Starting database migration...');
    await migrateMockData();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
