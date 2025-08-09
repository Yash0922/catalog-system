#!/bin/bash

# Cloud deployment script (no Docker required)
set -e

echo "☁️ Cloud Deployment Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if git is initialized
check_git() {
    if [ ! -d ".git" ]; then
        print_warning "Git repository not initialized. Initializing..."
        git init
        git add .
        git commit -m "Initial commit"
    fi
}

# Deploy to Railway (Backend)
deploy_railway() {
    print_info "🚂 Setting up Railway deployment for backend..."
    
    echo "1. Go to https://railway.app"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
    echo "4. Select this repository"
    echo "5. Choose 'backend' folder as root directory"
    echo "6. Add PostgreSQL service:"
    echo "   - Click '+ New' → 'Database' → 'PostgreSQL'"
    echo "7. Set environment variables:"
    echo "   - NODE_ENV=production"
    echo "   - FRONTEND_URL=https://your-frontend-domain.vercel.app"
    echo "8. Railway will automatically set DATABASE_URL"
    echo ""
    read -p "Press Enter when Railway backend deployment is complete..."
    
    read -p "Enter your Railway backend URL (e.g., https://your-app.railway.app): " BACKEND_URL
    echo "Backend URL: $BACKEND_URL"
}

# Deploy to Vercel (Frontend)
deploy_vercel() {
    print_info "▲ Setting up Vercel deployment for frontend..."
    
    echo "1. Go to https://vercel.com"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New Project'"
    echo "4. Import this repository"
    echo "5. Configure project:"
    echo "   - Framework Preset: Create React App"
    echo "   - Root Directory: frontend"
    echo "   - Build Command: npm run build"
    echo "   - Output Directory: build"
    echo "6. Set environment variables:"
    echo "   - REACT_APP_API_URL=$BACKEND_URL/api"
    echo "7. Deploy!"
    echo ""
    read -p "Press Enter when Vercel frontend deployment is complete..."
    
    read -p "Enter your Vercel frontend URL (e.g., https://your-app.vercel.app): " FRONTEND_URL
    echo "Frontend URL: $FRONTEND_URL"
}

# Deploy to Netlify (Alternative Frontend)
deploy_netlify() {
    print_info "🌐 Setting up Netlify deployment for frontend..."
    
    echo "1. Go to https://netlify.com"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New site from Git'"
    echo "4. Choose GitHub and select this repository"
    echo "5. Configure build settings:"
    echo "   - Base directory: frontend"
    echo "   - Build command: npm run build"
    echo "   - Publish directory: frontend/build"
    echo "6. Set environment variables:"
    echo "   - REACT_APP_API_URL=$BACKEND_URL/api"
    echo "7. Deploy!"
    echo ""
    read -p "Press Enter when Netlify deployment is complete..."
}

# Deploy to Heroku (Alternative Backend)
deploy_heroku() {
    print_info "🟣 Setting up Heroku deployment for backend..."
    
    if ! command -v heroku &> /dev/null; then
        print_warning "Heroku CLI not found. Install it from: https://devcenter.heroku.com/articles/heroku-cli"
        return
    fi
    
    echo "Setting up Heroku deployment..."
    
    # Create Heroku app
    read -p "Enter your desired Heroku app name (e.g., my-catalog-backend): " HEROKU_APP_NAME
    
    cd backend
    
    # Initialize git if needed
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit"
    fi
    
    # Create Heroku app
    heroku create $HEROKU_APP_NAME
    
    # Add PostgreSQL addon
    heroku addons:create heroku-postgresql:mini
    
    # Set environment variables
    heroku config:set NODE_ENV=production
    
    # Deploy
    git push heroku main
    
    # Get app URL
    BACKEND_URL="https://$HEROKU_APP_NAME.herokuapp.com"
    echo "Backend deployed to: $BACKEND_URL"
    
    cd ..
}

# Main deployment menu
main() {
    print_status "🚀 Cloud Deployment Options"
    echo ""
    echo "Choose your deployment strategy:"
    echo "1) Railway (Backend) + Vercel (Frontend) [Recommended]"
    echo "2) Railway (Backend) + Netlify (Frontend)"
    echo "3) Heroku (Backend) + Vercel (Frontend)"
    echo "4) Heroku (Backend) + Netlify (Frontend)"
    echo "5) Manual setup instructions only"
    echo "6) Exit"
    echo ""
    
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            check_git
            deploy_railway
            deploy_vercel
            print_status "🎉 Deployment complete!"
            print_status "Frontend: $FRONTEND_URL"
            print_status "Backend: $BACKEND_URL"
            ;;
        2)
            check_git
            deploy_railway
            deploy_netlify
            print_status "🎉 Deployment complete!"
            ;;
        3)
            check_git
            deploy_heroku
            deploy_vercel
            print_status "🎉 Deployment complete!"
            ;;
        4)
            check_git
            deploy_heroku
            deploy_netlify
            print_status "🎉 Deployment complete!"
            ;;
        5)
            print_info "📖 Manual Setup Instructions:"
            echo ""
            echo "Backend Options:"
            echo "- Railway: https://railway.app (Recommended)"
            echo "- Heroku: https://heroku.com"
            echo "- Render: https://render.com"
            echo "- AWS Elastic Beanstalk"
            echo ""
            echo "Frontend Options:"
            echo "- Vercel: https://vercel.com (Recommended)"
            echo "- Netlify: https://netlify.com"
            echo "- AWS S3 + CloudFront"
            echo "- Firebase Hosting"
            echo ""
            echo "Database Options:"
            echo "- Railway PostgreSQL (with Railway backend)"
            echo "- Heroku PostgreSQL (with Heroku backend)"
            echo "- Supabase: https://supabase.com"
            echo "- AWS RDS"
            ;;
        6)
            print_status "Deployment cancelled."
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-6."
            exit 1
            ;;
    esac
}

# Run main function
main