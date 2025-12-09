require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');

// Connect MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinRoom', (room) => socket.join(room));
  socket.on('leaveRoom', (room) => socket.leave(room));
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/receivers', require('./routes/receivers'));
app.use('/api/admin', require('./routes/admin'));

// Expired food auto-update
const markExpired = async () => {
  try {
    const now = new Date();
    const FoodDonation = require('./models/FoodDonation');
    await FoodDonation.updateMany(
      { expiresAt: { $lte: now }, status: { $ne: 'expired' } },
      { status: 'expired' }
    );
    console.log('Expired food updated');
  } catch (err) {
    console.error('Error updating expired food:', err.message);
  }
};
setInterval(markExpired, 1000 * 60 * 60); // every hour

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
