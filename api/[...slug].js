// api/[...slug].js - Catch-all API handler
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

  const slug = req.query.slug || [];
  const endpoint = Array.isArray(slug) ? slug[0] : slug;

  try {
    switch (endpoint) {
      case 'test':
        res.json({ 
          status: 'OK', 
          message: 'API is working!',
          timestamp: new Date().toISOString()
        });
        break;

      case 'health':
        res.json({ 
          status: 'OK', 
          message: 'EclipseAI API is running',
          timestamp: new Date().toISOString()
        });
        break;

      case 'dbtest':
        const { db } = await connectToDatabase();
        const collections = await db.listCollections().toArray();
        res.json({ 
          status: 'OK', 
          message: 'Database connection successful!',
          collections: collections.map(col => col.name),
          timestamp: new Date().toISOString()
        });
        break;

      case 'signup':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        const { firstName, lastName, email, company, password, agreeTerms, newsletter } = req.body;
        
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        const { db: signupDb } = await connectToDatabase();
        const usersCollection = signupDb.collection('users');
        
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
          return res.status(400).json({ error: 'Email already registered' });
        }
        
        const hash = await bcrypt.hash(password, 10);
        
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
        break;

      case 'login':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        const { email: loginEmail, password: loginPassword } = req.body;
        
        if (!loginEmail || !loginPassword) {
          return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const { db: loginDb } = await connectToDatabase();
        const usersCollectionLogin = loginDb.collection('users');
        
        const user = await usersCollectionLogin.findOne({ email: loginEmail });
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isValidPassword = await bcrypt.compare(loginPassword, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        await usersCollectionLogin.updateOne(
          { email: loginEmail }, 
          { $set: { lastLogin: new Date() } }
        );
        
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
        break;

      default:
        res.status(404).json({ 
          error: 'Endpoint not found',
          availableEndpoints: ['test', 'health', 'dbtest', 'signup', 'login']
        });
    }
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
