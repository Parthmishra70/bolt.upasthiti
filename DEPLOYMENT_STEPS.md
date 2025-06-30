# 🚀 Step-by-Step Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier available)
- Railway/Netlify accounts (free tiers available)

## Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Sandbox - Free)

### 1.2 Configure Database Access
1. **Network Access**: 
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for deployment
2. **Database Access**:
   - Go to Database Access → Add New Database User
   - Create user with read/write permissions
   - Remember username and password

### 1.3 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

## Step 2: Prepare Code for Deployment

### 2.1 Update Environment Variables
Create `.env.production` file with:
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret_32_chars_min
CORS_ORIGIN=https://your-frontend-domain.netlify.app
```

### 2.2 Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 3: Deploy Backend (Railway)

### 3.1 Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js and deploy

### 3.2 Configure Environment Variables
1. Go to your project dashboard
2. Click on "Variables" tab
3. Add these variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `PORT`: `5000`

### 3.3 Get Backend URL
- Copy your Railway app URL (e.g., `https://your-app-name.railway.app`)

## Step 4: Deploy Frontend (Netlify)

### 4.1 Build Configuration
1. Update `src/config/environment.ts` with your Railway backend URL
2. Commit and push changes

### 4.2 Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect GitHub account
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 4.3 Configure Environment Variables
In Netlify dashboard → Site settings → Environment variables:
- `VITE_API_URL`: `https://your-railway-app.railway.app/api`

### 4.4 Update CORS
Update your Railway environment variable:
- `CORS_ORIGIN`: `https://your-netlify-site.netlify.app`

## Step 5: Deploy AI Service (Optional)

### 5.1 Create Separate Repository
1. Create new repository for Python AI service
2. Add your Python face recognition code
3. Create `requirements.txt`:
```txt
flask==2.3.3
opencv-python==4.8.1.78
face-recognition==1.3.0
numpy==1.24.3
pillow==10.0.1
flask-cors==4.0.0
```

### 5.2 Deploy to Railway
1. Deploy Python service to Railway
2. Update frontend to use AI service URL

## Step 6: Testing & Verification

### 6.1 Test All Functionality
1. **Authentication**: Login/signup
2. **Admin Dashboard**: Create subjects, timetables
3. **Faculty Dashboard**: Take attendance
4. **Student Dashboard**: View attendance
5. **Database**: Verify data persistence

### 6.2 Check API Endpoints
Test these endpoints:
- `GET /api/health` - Server health
- `POST /api/auth/login` - Authentication
- `GET /api/subjects` - Data retrieval

## Step 7: Domain Setup (Optional)

### 7.1 Custom Domain
1. Purchase domain from Namecheap/GoDaddy
2. Configure DNS in Netlify
3. Update CORS settings with new domain

## Step 8: Monitoring & Maintenance

### 8.1 Set Up Monitoring
1. Use Railway/Netlify built-in monitoring
2. Set up error tracking (optional: Sentry)
3. Monitor database performance in Atlas

### 8.2 Backup Strategy
1. MongoDB Atlas provides automatic backups
2. Keep your code in version control
3. Document your deployment process

## Troubleshooting Common Issues

### CORS Errors
- Verify CORS_ORIGIN matches your frontend domain exactly
- Check both Railway and Netlify URLs

### Database Connection Issues
- Verify MongoDB connection string
- Check network access settings in Atlas
- Ensure database user has correct permissions

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check for TypeScript errors

### Environment Variables
- Ensure all required variables are set
- Check variable names match exactly
- Restart services after updating variables

## Final URLs Structure
After deployment:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-backend-name.railway.app`
- **Database**: MongoDB Atlas cluster

## Security Checklist
- ✅ Strong JWT secret (32+ characters)
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ Database access restricted
- ✅ HTTPS enabled (automatic on Railway/Netlify)

Your education management system is now live and ready for production use! 🎉