# Beauty Salon Backend

Backend API for the laser hair removal beauty salon mobile app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beauty-salon?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
```

   - **MONGODB_URI**: Get this from MongoDB Atlas (see `../MONGODB_ATLAS_SETUP.md`)
   - **JWT_SECRET**: A random secret string for JWT token signing

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Deployment

When deploying to cloud (Railway, Render, Heroku, etc.):

1. **Set up MongoDB Atlas** (see `../MONGODB_ATLAS_SETUP.md`)
2. **Add environment variables** in your deployment platform:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your JWT secret
   - `PORT` - Usually auto-set by platform

3. Make sure your deployment platform has Node.js support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new salon
- `POST /api/auth/login` - Login salon

### Customers
- `GET /api/customers` - Get all customers (alphabetically ordered)
- `GET /api/customers/search?query=name` - Search customers by name
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Appointments
- `GET /api/appointments/customer/:customerId` - Get all appointments for a customer
- `GET /api/appointments/customer/:customerId/progress` - Get progress statistics
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

All endpoints except auth require a Bearer token in the Authorization header.

## Important Notes

- **For cloud deployment**: You MUST use MongoDB Atlas (cloud database). Local MongoDB will not work.
- The `MONGODB_URI` environment variable is **required** - the server will not start without it.
- Never commit `.env` file to version control.
