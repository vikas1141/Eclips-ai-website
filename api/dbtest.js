// api/dbtest.js - Database connection test
const { MongoClient } = require('mongodb');

// Use a connection string that works with Vercel serverless
const MONGODB_URI = 'mongodb+srv://sagirajusaivikasvarma_db_user:kOecLqoXRffPVsCY@cluster1.ye6tavk.mongodb.net/eclipse_ai?retryWrites=true&w=majority';

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
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    // Try minimal connection options that work with Vercel
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('eclipse_ai');
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    await client.close();
    console.log('Connection closed');
    
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful!',
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