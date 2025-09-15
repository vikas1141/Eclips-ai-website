# EclipseAI Website Deployment Guide

## Quick Deployment to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import your GitHub repository** (`vikas1141/Eclips-ai-website`)
4. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     MONGODB_URI = mongodb+srv://sagirajusaivikasvarma_db_user:kOecLqoXRffPVsCY@cluster1.ye6tavk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1
     JWT_SECRET = your-super-secret-jwt-key-here-make-it-long-and-random-12345
     ```
5. **Click "Deploy"** - Your site will be live in minutes!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project folder:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

## Alternative: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)** and sign up
2. **Connect your GitHub repository**
3. **Build settings:**
   - Build command: `cd server && npm install`
   - Publish directory: `/`
4. **Add environment variables in Site Settings**
5. **Deploy!**

## Environment Variables Needed

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT tokens (generate a long random string)

## After Deployment

1. Your website will be live at a URL like: `https://your-project-name.vercel.app`
2. Anyone can now register and login to your website
3. The authentication system will work globally
4. Your MongoDB database will store all user data

## Testing Your Live Site

1. Visit your deployed URL
2. Try registering a new account
3. Try logging in with that account
4. Check if the user dropdown appears after login

## Troubleshooting

- **Database connection issues**: Check if your MongoDB URI is correct
- **CORS errors**: The server is configured to allow all origins
- **API not working**: Ensure environment variables are set correctly

## Security Notes

- Your JWT secret should be a long, random string
- MongoDB Atlas should have proper IP whitelist settings
- Consider enabling MongoDB authentication for production

Your EclipseAI website is now ready for global access! 🌟
