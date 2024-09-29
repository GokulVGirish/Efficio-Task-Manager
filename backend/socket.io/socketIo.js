import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A new user has connected: ${socket.id}`);

    const token = socket.handshake.auth.token;

    if (token) {
      const decodedToken = verifyAccessToken(token);
      const userId = decodedToken?.id;
      if (userId) {
        socket.join(userId.toString());
      }
    }
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
