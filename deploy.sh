#!/bin/bash

# Deployment script for the catalog system
set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_status "Requirements check passed ✅"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    cd backend
    
    # Install dependencies
    npm ci --only=production
    
    # Generate Prisma client
    npx prisma generate
    
    # Build TypeScript
    npm run build
    
    print_status "Backend build completed ✅"
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    
    # Install dependencies
    npm ci --only=production
    
    # Build React app
    npm run build
    
    print_status "Frontend build completed ✅"
    cd ..
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    # Build and start containers
    docker-compose down
    docker-compose build
    docker-compose up -d
    
    print_status "Docker deployment completed ✅"
}

# Deploy to Heroku
deploy_heroku() {
    print_status "Deploying to Heroku..."
    
    # Deploy backend
    cd backend
    if command -v heroku &> /dev/null; then
        heroku create your-catalog-backend --region us
        git subtree push --prefix backend heroku main
    else
        print_warning "Heroku CLI not found. Please install it to deploy to Heroku."
    fi
    cd ..
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    cd frontend
    if command -v vercel &> /dev/null; then
        vercel --prod
    else
        print_warning "Vercel CLI not found. Please install it to deploy to Vercel."
    fi
    cd ..
}

# Main deployment function
main() {
    echo "Select deployment option:"
    echo "1) Local Docker deployment"
    echo "2) Build only (no deployment)"
    echo "3) Heroku + Vercel deployment"
    echo "4) Exit"
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            check_requirements
            build_backend
            build_frontend
            deploy_docker
            print_status "🎉 Local deployment completed!"
            print_status "Frontend: http://localhost:3000"
            print_status "Backend: http://localhost:3001"
            ;;
        2)
            check_requirements
            build_backend
            build_frontend
            print_status "🎉 Build completed!"
            ;;
        3)
            check_requirements
            build_backend
            build_frontend
            deploy_heroku
            deploy_vercel
            print_status "🎉 Cloud deployment initiated!"
            ;;
        4)
            print_status "Deployment cancelled."
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-4."
            exit 1
            ;;
    esac
}

# Run main function
main