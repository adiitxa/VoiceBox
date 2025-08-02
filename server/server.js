require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Database connection
connectDB();

// CORS Configuration (similar to your working version)
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// Middleware (same as your working version)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Route imports (keep your existing route files)
const authRoutes = require('./routes/authRoutes');
const episodeRoutes = require('./routes/episodeRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// Mount routes (same mounting points as your working version)
app.use('/api/auth', authRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error handling (same as your working version)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
