import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.role = decoded.role;
      console.log(socket,'socket');
      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected with role ${socket.role}`);

    if (socket.role == 'admin') {
      socket.join('admins');
      console.log(`Admin ${socket.userId} joined 'admins' room`);
    } else if (socket.role == 'client') {
      socket.join(`user_${socket.userId}`);
      console.log(`Client ${socket.userId} joined 'user_${socket.userId}' room`);
    } else {
      console.log(`User ${socket.userId} has unknown role: ${socket.role}`);
    }

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });


  return io;
};

export const sendNotificationToUser = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', notification);
  }
};

export const sendNotificationToAdmins = (notification) => {
  if (io) {
    io.to('admins').emit('new_notification', notification);
  }
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}; 