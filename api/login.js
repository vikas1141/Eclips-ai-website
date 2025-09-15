// api/login.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sagirajusaivikasvarma_db_user:kOecLqoXRffPVsCY@cluster1.ye6tavk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('eclipse_ai');
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await usersCollection.updateOne(
      { email }, 
      { $set: { lastLogin: new Date() } }
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
