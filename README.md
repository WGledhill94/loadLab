# LoadLab
Performance testing e-commerce website for learning Artillery, K6, and Playwright testing.

## Features
- Product search and filtering
- Shopping cart functionality  
- User registration/login
- Guest checkout
- Mock payment processing
- Email confirmations

## Quick Start
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Start backend (port 5000)
npm start

# Start frontend (port 3000) - new terminal
cd client && npm start
```

## Testing
- **Playwright**: Tests in `/tests` with page object model
- **Load Testing**: Ready for Artillery & K6 against API endpoints
- **AWS Deployment**: Compatible with WALT Shell

## API Endpoints
- `GET /api/products` - Get products with filtering
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/checkout` - Process orders
- `GET /api/health` - Health check for load testing

## GitHub Pages Deployment
Push to main branch to auto-deploy via GitHub Actions.