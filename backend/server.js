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
import fs from "fs";

// 🛠 הגדרה נכונה של __dirname עבור ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true,
};

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// ✅ בדיקה של הראוטים
console.log("✅ typeof userRoutes:", typeof userRoutes); // צריך להיות 'function'
console.log("✅ typeof gameRoutes:", typeof gameRoutes); // צריך להיות 'function'

// Routes
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../frontend/build");

  if (fs.existsSync(staticPath)) {
    console.log("✅ Static build folder found at:", staticPath);
    app.use(express.static(staticPath));
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(staticPath, "index.html"))
    );
  } else {
    console.warn(
      "⚠️ Static build folder not found — skipping frontend serving."
    );
  }
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketManager(io);

// Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
