import { NextResponse } from 'next/server';
import { migrateMockData } from '../../../lib/services/database/migrateData';

export async function POST() {
  try {
    console.log('Starting data migration via API...');
    await migrateMockData();
    console.log('Migration completed successfully via API!');

    return NextResponse.json({
      success: true,
      message: 'Data migration completed successfully'
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Migration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to run data migration',
    endpoint: 'POST /api/migrate'
  });
}
