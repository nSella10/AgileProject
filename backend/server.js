// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import socketManager from "./sockets/index.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🎵 Music Game API is running");
});

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // חשוב להתאים ל-frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketManager(io);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
