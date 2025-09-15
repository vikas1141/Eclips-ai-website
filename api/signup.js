// api/signup.js
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sagirajusaivikasvarma_db_user:kOecLqoXRffPVsCY@cluster1.ye6tavk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

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
    const { firstName, lastName, email, company, password, agreeTerms, newsletter } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Create user object
    const user = {
      firstName,
      lastName,
      email,
      company: company || null,
      password: hash,
      agreeTerms,
      newsletter: newsletter || false,
      createdAt: new Date(),
      lastLogin: null
    };
    
    await usersCollection.insertOne(user);
    
    res.json({ 
      success: true, 
      message: 'Account created successfully!',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
