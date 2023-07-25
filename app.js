const connectDB = require('./db/connect');
require('dotenv').config();
const express = require('express');
const app = express();

// Security Packages
const helmet = require('helmet');
const cors = require('cors');

// Routes
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');

// Import Middlewares
const authMiddleware = require('./middleware/authentication');
const errorHandler = require('./middleware/error-handler');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Middlewares
app.use(express.json());
// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobRouter);

app.use(errorHandler);


const port = process.env.PORT || 5000;
// Connect to The Server
app.listen(port, async () => {
  try {
    // Connect to DB
    await connectDB(process.env.MONGO_URI);
    console.log(`The Server is Listening on Port ${port}`);
  } catch (err) {
    console.log(err);
  }
});