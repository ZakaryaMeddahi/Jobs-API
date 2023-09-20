const cookieParser = require('cookie-parser');
const connectDB = require('./db/connect');
require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const { StatusCodes } = require('http-status-codes');

// import Models
const Job = require("./models/Job");
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

// Set Template Engin
app.set("view engine", "pug");

// Security Packages
const helmet = require('helmet');
const cors = require('cors');

// Socket Controllers
const { 
  authenticate, 
  openRoom, 
  sendMessage, 
  disconnect 
} = require('./controllers/chat');

// Routes
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');
const pagesRouter = require('./routes/pages');
const chatRouter = require('./routes/chat');
const userRouter = require('./routes/users');

// Import Middlewares
const authMiddleware = require('./middleware/authentication');
const errorHandler = require('./middleware/error-handler');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Middlewares
app.use(express.json());
app.use(cookieParser());
// Security Middlewares
// app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

app.use(express.static('public'));

app.use('/', pagesRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobRouter);
app.use('api/v1/users', authMiddleware, userRouter);
app.use('/api/v1/rooms', authMiddleware, chatRouter);

app.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const users = await User.find({ _id: { $ne: userId } });
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).render('dashboard', { users, jobs });
});

app.get('/api/v1/rooms', async (req, res) => {
  const room = await Room.findOne({ 
    $or:[
      { firstUser: senderId, secondUser: recipentId },
      { firstUser: recipentId, secondUser: senderId }
    ]
  });
  const messages = Message.find({ roomId: room._id });
  res.status(StatusCodes.OK).json({
    success: true,
    messages
  });
});

app.get('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).render('not-found');
});

// Chat
io.on('connection', (socket) => {
  authenticate(socket);
  openRoom(socket);
  sendMessage(socket);
  disconnect(socket);
});

// Handle Errors
app.use(errorHandler);

const port = /*process.env.PORT || */5000;
// Connect to The Server
server.listen(port, async () => {
  try {
    // Connect to DB
    await connectDB(process.env.MONGO_URI);
    console.log(`The Server is Listening on Port ${port}`);
  } catch (err) {
    console.error(Error(err));
  }
});