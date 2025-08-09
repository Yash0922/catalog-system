# Quick Deployment Guide (No Docker Required)

Since Docker is not available on your system, here are alternative deployment methods that work immediately.

## 🚀 Option 1: Local Development (Fastest)

### Prerequisites
- Node.js (already installed ✅)
- PostgreSQL

### Install PostgreSQL on macOS
```bash
# Install PostgreSQL using Homebrew
brew install postgresql

# Start PostgreSQL service
brew services start postgresql
```

### Deploy Locally
```bash
# Run the local deployment script
./deploy-local.sh
```

This script will:
1. ✅ Check PostgreSQL installation
2. 🗄️ Create database
3. ⚙️ Setup backend (install deps, run migrations, seed data)
4. 🎨 Setup frontend (install deps)
5. 🚀 Start both services

**Access your app:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## ☁️ Option 2: Cloud Deployment (Production Ready)

### Quick Cloud Setup
```bash
# Run the cloud deployment script
./deploy-cloud.sh
```

### Recommended Stack: Railway + Vercel

#### 1. Deploy Backend to Railway (5 minutes)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose "backend" as root directory
6. Add PostgreSQL database service
7. Set environment variables:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

#### 2. Deploy Frontend to Vercel (3 minutes)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

---

## 🔧 Option 3: Manual Local Setup

If the scripts don't work, here's the manual process:

### 1. Setup Database
```bash
# Install PostgreSQL (if not installed)
brew install postgresql
brew services start postgresql

# Create database
createdb catalog_db
```

### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Start backend
npm run dev
```

### 3. Setup Frontend (in new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with backend URL (http://localhost:3001/api)

# Start frontend
npm start
```

---

## 🐳 Option 4: Install Docker (Optional)

If you want to use Docker later:

### Install Docker on macOS
```bash
# Install Docker Desktop
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
```

### Then use Docker Compose
```bash
# After Docker is installed
docker-compose up -d
```

---

## 🌐 Alternative Cloud Platforms

### Backend Options:
- **Railway** (Recommended) - Free tier, easy setup
- **Heroku** - Classic PaaS, free tier available
- **Render** - Modern alternative to Heroku
- **AWS Elastic Beanstalk** - More complex but powerful

### Frontend Options:
- **Vercel** (Recommended) - Best for React apps
- **Netlify** - Great alternative with form handling
- **AWS S3 + CloudFront** - Scalable but complex
- **Firebase Hosting** - Google's hosting solution

### Database Options:
- **Railway PostgreSQL** (with Railway backend)
- **Heroku PostgreSQL** (with Heroku backend)
- **Supabase** - Firebase alternative with PostgreSQL
- **AWS RDS** - Managed database service

---

## 🚨 Troubleshooting

### PostgreSQL Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql

# Check PostgreSQL status
brew services list | grep postgresql
```

### Port Issues
If ports 3000 or 3001 are busy:
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Kill processes on port 3001
lsof -ti:3001 | xargs kill -9
```

### Environment Variables
Make sure your `.env` files are configured:

**Backend `.env`:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/catalog_db?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:3001/api
PORT=3000
```

---

## 🎯 Next Steps

1. **Choose your deployment method** (local or cloud)
2. **Run the appropriate script** or follow manual steps
3. **Test your application** at the provided URLs
4. **Set up custom domains** (for cloud deployments)
5. **Configure monitoring** and error tracking

**Need help?** Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide or create an issue in the repository.

---

**Happy deploying! 🚀**