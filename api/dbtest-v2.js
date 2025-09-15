// api/dbtest-v2.js - Alternative MongoDB connection test
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sagirajusaivikasvarma_db_user:kOecLqoXRffPVsCY@cluster1.ye6tavk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Testing MongoDB connection with minimal options...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    // Try with minimal connection options
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      maxPoolSize: 1,
      minPoolSize: 1,
      maxIdleTimeMS: 10000
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Test basic operations
    const db = client.db('eclipse_ai');
    await db.admin().ping();
    console.log('Database ping successful');
    
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    await client.close();
    console.log('Connection closed');
    
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful with minimal options!',
      collections: collections.map(col => col.name),
      timestamp: new Date().toISOString(),
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        uriLength: MONGODB_URI.length
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        uriLength: MONGODB_URI.length
      }
    });
  }
};
