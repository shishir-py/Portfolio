import { MongoClient } from 'mongodb';

// Connection URI
const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// Skip MongoDB connection if no URI is provided
if (!uri) {
  console.warn('MongoDB URI not found. Database features will not be available.');
} else {
  try {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement)
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect().catch(err => {
          console.error('Failed to connect to MongoDB:', err);
          return null;
        });
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable
      client = new MongoClient(uri, options);
      clientPromise = client.connect().catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        return null;
      });
    }
  } catch (error) {
    console.error('Error initializing MongoDB connection:', error);
    clientPromise = null;
  }
}

// Helper function to connect to the database
export async function connectToDatabase() {
  if (!uri) {
    return { db: null, client: null };
  }
  
  try {
    if (!clientPromise) {
      return { db: null, client: null };
    }
    
    const client = await clientPromise;
    if (!client) {
      return { db: null, client: null };
    }
    
    const db = client.db(process.env.MONGODB_DB || 'portfolio');
    return { client, db };
  } catch (error) {
    console.error('Error connecting to database:', error);
    return { db: null, client: null };
  }
}

export default clientPromise; 