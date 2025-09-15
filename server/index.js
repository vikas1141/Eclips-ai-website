// server/index.js
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

// JWT Secret (in production, use environment variables)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Replace with your cluster's string
const uri = 'mongodb+srv://sagirajusaivikasvarma_db_user:kOecLqoXRffPVsCY@cluster1.ye6tavk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';
const client = new MongoClient(uri);

let usersCollection;

// Connect to MongoDB
async function connectDB() {
  await client.connect();
  const db = client.db('eclipse_ai'); // You can name this DB as you wish
  usersCollection = db.collection('users');
}
connectDB();

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, company, password, agreeTerms, newsletter } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
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
    
    // Insert user
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
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
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
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Protected route example - get user profile
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the parent directory
app.use(express.static('../'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EclipseAI API is running' });
});

app.listen(4000, () => {
  console.log('🚀 EclipseAI API server running on port 4000');
  console.log('📁 Serving static files from parent directory');
  console.log('🔗 API endpoints:');
  console.log('   POST /api/signup - User registration');
  console.log('   POST /api/login - User authentication');
  console.log('   GET  /api/profile - Get user profile (requires token)');
  console.log('   GET  /api/health - Health check');
});
