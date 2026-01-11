# Beauty Salon Backend

Backend API for the laser hair removal beauty salon mobile app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/beauty-salon
JWT_SECRET=your-secret-key-change-this-in-production
```

   Update the values:
   - `MONGODB_URI`: Your MongoDB connection string (use `mongodb://localhost:27017/beauty-salon` for local MongoDB)
   - `JWT_SECRET`: A random secret string for JWT token signing (use a strong, random string in production)

   See `ENV_SETUP.md` for detailed instructions.

4. Make sure MongoDB is running on your system.

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

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

