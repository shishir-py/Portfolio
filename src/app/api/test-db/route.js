import { connectToDatabase } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    if (!db) {
      return NextResponse.json(
        { status: 'error', message: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Test database operations
    const testCollection = db.collection('test');
    
    // Insert test document
    const insertResult = await testCollection.insertOne({
      timestamp: new Date(),
      test: 'Database connection successful'
    });

    // Retrieve test document
    const testDoc = await testCollection.findOne({ _id: insertResult.insertedId });

    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });

    return NextResponse.json({
      status: 'success',
      message: 'Database connection and operations successful',
      testDocument: testDoc
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
} 