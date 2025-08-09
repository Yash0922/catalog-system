# Deployment Guide

This guide covers multiple deployment options for the Catalog System, including cloud platforms and containerized deployments.

## Quick Start Deployment

### Option 1: One-Click Deployment Script

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Option 2: Docker Compose (Recommended for Local/VPS)

```bash
# Clone the repository
git clone <your-repo-url>
cd catalog-system

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

Access your application:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

## Cloud Platform Deployments

### 1. Vercel + Railway (Recommended)

#### Deploy Backend to Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app)

2. **Connect GitHub**: Link your repository

3. **Deploy Backend**:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy backend
   cd backend
   railway up
   ```

4. **Add Database**: In Railway dashboard, add PostgreSQL service

5. **Set Environment Variables**:
   ```
   DATABASE_URL=<railway-postgres-url>
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

#### Deploy Frontend to Vercel

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)

2. **Connect GitHub**: Import your repository

3. **Configure Build Settings**:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

### 2. Heroku Deployment

#### Backend on Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-catalog-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.netlify.app

# Deploy
git subtree push --prefix backend heroku main
```

#### Frontend on Netlify

1. **Connect Repository**: Link GitHub repo to Netlify
2. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
3. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.herokuapp.com/api
   ```

### 3. AWS Deployment

#### Backend on AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
cd backend
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

#### Frontend on AWS S3 + CloudFront

```bash
# Build the frontend
cd frontend
npm run build

# Install AWS CLI
# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-catalog-frontend

# Upload build files
aws s3 sync build/ s3://your-catalog-frontend

# Enable static website hosting
aws s3 website s3://your-catalog-frontend --index-document index.html
```

### 4. Google Cloud Platform

#### Backend on Cloud Run

```bash
# Build and push Docker image
cd backend
gcloud builds submit --tag gcr.io/PROJECT-ID/catalog-backend

# Deploy to Cloud Run
gcloud run deploy --image gcr.io/PROJECT-ID/catalog-backend --platform managed
```

#### Frontend on Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
cd frontend
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Environment Variables Setup

### Backend Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database

# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Optional: Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

### Frontend Environment Variables

```env
# API Configuration
REACT_APP_API_URL=https://your-backend-domain.com/api

# Build Configuration
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false

# Optional: Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
```

## Database Setup for Production

### 1. Managed Database Services

#### Railway PostgreSQL
- Automatically provisioned with Railway backend deployment
- Connection string provided in environment variables

#### Heroku PostgreSQL
```bash
heroku addons:create heroku-postgresql:mini
```

#### AWS RDS
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier catalog-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password yourpassword \
  --allocated-storage 20
```

### 2. Database Migration

```bash
# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

## SSL/HTTPS Setup

### Automatic SSL (Recommended)
- **Vercel**: Automatic SSL certificates
- **Netlify**: Automatic SSL certificates
- **Railway**: Automatic SSL certificates
- **Heroku**: Automatic SSL certificates

### Custom Domain Setup

1. **Add Custom Domain** in your platform dashboard
2. **Update DNS Records**:
   ```
   Type: CNAME
   Name: www
   Value: your-app.platform.com
   ```
3. **Update Environment Variables** with new domain

## Monitoring and Logging

### Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/node @sentry/react

# Configure in backend
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });

# Configure in frontend
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
```

### Performance Monitoring

#### Backend Monitoring
- Use platform-specific monitoring (Railway, Heroku, etc.)
- Add health check endpoint: `GET /health`

#### Frontend Monitoring
- Google Analytics
- Vercel Analytics
- Web Vitals monitoring

## CI/CD Pipeline

### GitHub Actions (Included)

The repository includes a GitHub Actions workflow that:
1. Runs tests on pull requests
2. Deploys to production on main branch pushes
3. Supports multiple deployment targets

### Required Secrets

Add these secrets to your GitHub repository:

```
RAILWAY_TOKEN=your-railway-token
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-vercel-org-id
PROJECT_ID=your-vercel-project-id
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check database service status
   - Ensure migrations are deployed

2. **CORS Issues**
   - Update FRONTEND_URL in backend environment
   - Check allowed origins in CORS configuration

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Verify values don't contain special characters

### Health Checks

#### Backend Health Check
```bash
curl https://your-backend.com/health
```

#### Frontend Health Check
```bash
curl https://your-frontend.com
```

## Performance Optimization

### Backend Optimization
- Enable gzip compression
- Use connection pooling for database
- Implement caching (Redis)
- Add rate limiting

### Frontend Optimization
- Enable code splitting
- Optimize images
- Use CDN for static assets
- Implement service worker for caching

## Security Considerations

### Backend Security
- Use HTTPS only
- Implement rate limiting
- Validate all inputs
- Use environment variables for secrets
- Enable CORS properly

### Frontend Security
- Use HTTPS only
- Implement CSP headers
- Sanitize user inputs
- Use secure authentication

## Scaling

### Horizontal Scaling
- Use load balancers
- Deploy multiple instances
- Implement session management

### Database Scaling
- Use read replicas
- Implement connection pooling
- Consider database sharding for large datasets

## Backup and Recovery

### Database Backups
- Enable automatic backups on your database service
- Test backup restoration regularly
- Store backups in multiple locations

### Application Backups
- Use version control (Git)
- Backup environment configurations
- Document deployment procedures

---

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check application logs
4. Create an issue in the repository

**Happy deploying! 🚀**