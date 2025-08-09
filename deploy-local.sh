#!/bin/bash

# Local deployment script without Docker
set -e

echo "🚀 Starting local deployment without Docker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if PostgreSQL is running
check_postgres() {
    print_status "Checking PostgreSQL..."
    
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed. Please install it first:"
        echo "  macOS: brew install postgresql"
        echo "  Ubuntu: sudo apt-get install postgresql postgresql-contrib"
        exit 1
    fi
    
    # Try to connect to PostgreSQL
    if ! pg_isready -q; then
        print_warning "PostgreSQL is not running. Starting it..."
        if command -v brew &> /dev/null; then
            brew services start postgresql
        else
            sudo service postgresql start
        fi
        sleep 2
    fi
    
    print_status "PostgreSQL is running ✅"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Create database if it doesn't exist
    if ! psql -lqt | cut -d \| -f 1 | grep -qw catalog_db; then
        createdb catalog_db
        print_status "Database 'catalog_db' created ✅"
    else
        print_status "Database 'catalog_db' already exists ✅"
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Created backend .env file"
        print_warning "Please update DATABASE_URL in backend/.env if needed"
    fi
    
    # Install dependencies
    npm install
    
    # Generate Prisma client
    npx prisma generate
    
    # Run migrations
    npx prisma migrate dev --name init
    
    # Seed database
    npx prisma db seed
    
    print_status "Backend setup completed ✅"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    cd frontend
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Created frontend .env file"
    fi
    
    # Install dependencies
    npm install
    
    print_status "Frontend setup completed ✅"
    cd ..
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start backend in background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend in background
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_status "🎉 Services started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:3001"
    print_status ""
    print_status "Press Ctrl+C to stop all services"
    
    # Wait for user to stop services
    trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
    wait
}

# Main function
main() {
    check_postgres
    setup_database
    setup_backend
    setup_frontend
    start_services
}

# Run main function
main