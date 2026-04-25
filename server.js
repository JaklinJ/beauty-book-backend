const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
require("./cron/customerCron");

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/salons', require('./routes/salons'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/pricelists', require('./routes/pricelists'));
app.use('/api/zonedurations', require('./routes/zonedurations'));
app.use('/api/revenue', require('./routes/revenue'));
app.use('/privacy', require('./routes/privacy'));

app.get("/health", (req, res) => {
  res.send("Server is awake ✅");
});

// Database connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
  console.error('Please set MONGODB_URI in your deployment platform environment variables.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Make sure your MONGODB_URI is correct and MongoDB Atlas allows connections from your IP');
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
