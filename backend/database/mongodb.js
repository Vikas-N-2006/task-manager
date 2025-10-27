import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'taskmanager';

let client;
let db;

export const connectToDatabase = async () => {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
};

export const getCollection = (collectionName) => {
  return getDB().collection(collectionName);
};

export const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log('📭 MongoDB connection closed');
  }
};

// Helper to convert string ID to ObjectId
export const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    throw new Error('Invalid ID format');
  }
};

export { ObjectId };