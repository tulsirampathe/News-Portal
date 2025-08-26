import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import errorHandler from './middleware/error.js';
import cookieParser from 'cookie-parser';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
import auth from './routes/auth.js';
import news from './routes/news.js';

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',  // frontend origin
  credentials: true
}));



app.get("/", (req, res) => {
  res.send("Api is working....")
})

// Mount routers
app.use('/api/auth', auth);
app.use('/api/news', news);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});