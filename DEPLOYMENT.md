# Deployment Guide

This guide provides step-by-step instructions for deploying the Resume Builder application to various cloud platforms.

## Prerequisites

Before deploying, ensure you have:

1. **Git Repository**: Your code is pushed to a Git repository (GitHub, GitLab, etc.)
2. **MongoDB Database**: Set up MongoDB Atlas or another MongoDB service
3. **Environment Variables**: Prepare all necessary environment variables

## Environment Variables Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-builder
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Backend Deployment

### Option 1: Render (Recommended)

1. **Sign up/Login** to [Render](https://render.com)

2. **Create New Web Service**:

   - Connect your Git repository
   - Select the repository containing your code
   - Choose "Web Service"

3. **Configure the Service**:

   - **Name**: `resume-builder-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose appropriate plan (Free tier available)

4. **Environment Variables**:

   - Add all backend environment variables from above
   - Ensure `NODE_ENV=production`

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the generated URL (e.g., `https://resume-builder-backend.onrender.com`)

### Option 2: Railway

1. **Sign up/Login** to [Railway](https://railway.app)

2. **Create New Project**:

   - Connect your Git repository
   - Select "Deploy from GitHub repo"

3. **Configure the Service**:

   - Set root directory to `backend`
   - Railway will auto-detect Node.js

4. **Environment Variables**:

   - Add all backend environment variables
   - Set `PORT` to `$PORT` (Railway provides this)

5. **Deploy**:
   - Railway will automatically deploy
   - Get the generated URL from the dashboard

### Option 3: Heroku

1. **Install Heroku CLI** and login:

   ```bash
   heroku login
   ```

2. **Create Heroku App**:

   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**:

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set JWT_EXPIRE=30d
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## Frontend Deployment

### Option 1: Netlify (Recommended)

1. **Sign up/Login** to [Netlify](https://netlify.com)

2. **Create New Site**:

   - Connect your Git repository
   - Select the repository

3. **Configure Build Settings**:

   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: `16` (or higher)

4. **Environment Variables**:

   - Go to Site Settings > Environment Variables
   - Add `REACT_APP_API_URL` with your backend URL

5. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Get your site URL

### Option 2: Vercel

1. **Sign up/Login** to [Vercel](https://vercel.com)

2. **Import Project**:

   - Connect your Git repository
   - Select the repository

3. **Configure Project**:

   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**:

   - Add `REACT_APP_API_URL` with your backend URL

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### Option 3: GitHub Pages

1. **Update package.json** in frontend directory:

   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

2. **Install gh-pages**:

   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create Cluster**:

   - Choose "Shared" (free tier)
   - Select cloud provider and region
   - Click "Create"

3. **Configure Database Access**:

   - Go to "Database Access"
   - Create a new database user
   - Set username and password
   - Assign "Read and write to any database" role

4. **Configure Network Access**:

   - Go to "Network Access"
   - Add IP address `0.0.0.0/0` (allows all IPs)
   - Or add specific IP addresses for security

5. **Get Connection String**:
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** (if needed):

   - Use services like Namecheap, GoDaddy, or Google Domains

2. **Configure DNS**:

   - Add CNAME record pointing to your deployment URL
   - For Netlify: `your-domain.com` → `your-app.netlify.app`
   - For Vercel: `your-domain.com` → `your-app.vercel.app`

3. **SSL Certificate**:
   - Most platforms provide automatic SSL
   - Enable HTTPS redirect

### Subdomain Setup

1. **Create Subdomain**:

   - `api.your-domain.com` for backend
   - `app.your-domain.com` for frontend

2. **Update Environment Variables**:
   - Backend: Update `FRONTEND_URL`
   - Frontend: Update `REACT_APP_API_URL`

## Post-Deployment Checklist

### Backend Verification

- [ ] API is accessible at the deployed URL
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Database connection is working
- [ ] Environment variables are properly set
- [ ] CORS is configured for frontend domain

### Frontend Verification

- [ ] Frontend loads without errors
- [ ] Can register and login users
- [ ] Can create and edit resumes
- [ ] PDF download functionality works
- [ ] All API calls are working

### Security Verification

- [ ] HTTPS is enabled
- [ ] JWT tokens are working
- [ ] Password hashing is functional
- [ ] Rate limiting is active
- [ ] CORS is properly configured

## Monitoring and Maintenance

### Performance Monitoring

1. **Set up monitoring**:

   - Use platform-specific monitoring tools
   - Monitor response times and error rates
   - Set up alerts for downtime

2. **Database monitoring**:
   - Monitor MongoDB Atlas metrics
   - Set up alerts for connection issues
   - Monitor storage usage

### Regular Maintenance

1. **Update dependencies**:

   - Regularly update npm packages
   - Test updates in development first
   - Deploy updates during low-traffic periods

2. **Backup strategy**:

   - MongoDB Atlas provides automatic backups
   - Consider additional backup solutions
   - Test restore procedures

3. **Security updates**:
   - Keep JWT secrets secure
   - Rotate secrets periodically
   - Monitor for security vulnerabilities

## Troubleshooting

### Common Issues

1. **Build Failures**:

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors in code

2. **Database Connection Issues**:

   - Verify MongoDB URI is correct
   - Check network access settings
   - Ensure database user has proper permissions

3. **CORS Errors**:

   - Verify frontend URL in backend CORS configuration
   - Check environment variables
   - Test API endpoints directly

4. **Environment Variable Issues**:
   - Double-check all environment variables are set
   - Verify variable names match code
   - Restart services after changing variables

### Getting Help

- Check platform-specific documentation
- Review application logs
- Test locally with production environment variables
- Use platform support channels

## Cost Optimization

### Free Tier Limits

- **Render**: 750 hours/month for free tier
- **Railway**: $5/month for hobby plan
- **Netlify**: 100GB bandwidth/month free
- **Vercel**: 100GB bandwidth/month free
- **MongoDB Atlas**: 512MB storage free

### Scaling Considerations

- Monitor usage and upgrade plans as needed
- Consider CDN for static assets
- Optimize database queries
- Implement caching strategies

## Conclusion

After following this deployment guide, you should have a fully functional Resume Builder application deployed to the cloud. The application will be accessible via web browsers and can handle user registrations, resume creation, and PDF generation.

Remember to:

- Keep your deployment URLs and credentials secure
- Monitor your application regularly
- Update dependencies and security patches
- Scale resources as your user base grows
