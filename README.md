# Catalog System

A full-stack e-commerce catalog system built with React (frontend) and Node.js/Express (backend) with PostgreSQL database. The system supports products with variants, add-ons, and dynamic pricing with multi-currency support.

## Features

- **Product Catalog**: Browse products by categories (Food, Apparel, Electronics)
- **Product Variants**: Support for size, color/processor variations
- **Add-ons**: Customizable add-ons for products (especially food items)
- **Multi-currency**: USD to INR conversion with real-time rates
- **Responsive Design**: Mobile-friendly interface
- **Dynamic Labels**: Smart labeling (Color vs Processor for Electronics)

## Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma** ORM for database management
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd catalog-system
```

### 2. Database Setup

#### Install PostgreSQL
- **macOS**: `brew install postgresql`
- **Ubuntu**: `sudo apt-get install postgresql postgresql-contrib`
- **Windows**: Download from [PostgreSQL official website](https://www.postgresql.org/download/)

#### Create Database
```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Create database
createdb catalog_db

# Or using psql
psql -U postgres
CREATE DATABASE catalog_db;
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/catalog_db?schema=public"
```

#### Configure Environment Variables

Edit `backend/.env`:

```env
# Database Configuration
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/catalog_db?schema=public"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

#### Start Backend Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The backend server will start on `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

#### Configure Environment Variables

Edit `frontend/.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Development Configuration
PORT=3000
BROWSER=none
```

#### Start Frontend Server

```bash
# Development mode
npm start
```

The frontend application will start on `http://localhost:3000`

## Project Structure

```
catalog-system/
├── backend/
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── seed.ts          # Database seeding script
│   │   └── index.ts         # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── .env.example         # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── styles/          # CSS stylesheets
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── .env.example         # Environment variables template
│   └── package.json
├── csv-data/                # Sample data files
└── README.md
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Product Types
- `GET /api/product-types` - Get all product types

### Variants
- `GET /api/variants` - Get all variants
- `GET /api/variants/product/:productId` - Get variants by product ID

### Add-ons
- `GET /api/add-ons` - Get all add-ons
- `GET /api/add-ons/product/:productId` - Get add-ons by product ID

## Development

### Backend Development

```bash
cd backend

# Run in development mode with hot reload
npm run dev

# Run database migrations
npm run db:migrate

# Generate Prisma client after schema changes
npm run db:generate

# Reseed database
npm run db:seed
```

### Frontend Development

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (careful - this deletes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Sample Data

The system comes with pre-populated sample data including:

- **Food Items**: Pizza, Burgers with add-ons
- **Apparel**: T-shirts, Jeans with size/color variants
- **Electronics**: Smartphones, Laptops, Desktops with processor/storage variants

## Currency Support

The system supports USD to INR conversion with:
- Real-time exchange rates (when available)
- Fallback to cached rates
- Proper INR formatting (₹1,234.56)

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

2. **Port Already in Use**
   - Backend: Change PORT in backend/.env
   - Frontend: Change PORT in frontend/.env

3. **CORS Issues**
   - Verify FRONTEND_URL in backend/.env
   - Check proxy setting in frontend/package.json

4. **Prisma Client Issues**
   ```bash
   cd backend
   npm run db:generate
   ```

### Logs and Debugging

- Backend logs: Check terminal running `npm run dev`
- Frontend logs: Check browser console
- Database logs: Check PostgreSQL logs

## Production Deployment

### Backend Deployment

1. Set production environment variables
2. Run database migrations: `npx prisma migrate deploy`
3. Build the application: `npm run build`
4. Start the server: `npm start`

### Frontend Deployment

1. Set production API URL in .env
2. Build the application: `npm run build`
3. Serve the build folder using a web server

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and ensure they pass
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation

---

**Happy coding! 🚀**