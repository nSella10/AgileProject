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

// 🛠 הגדרת __dirname ל-ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// 🌐 CORS לפי סביבה
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://guessify-da1u.onrender.com", "https://www.guessifyapp.com"]
    : ["http://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};

// 🧩 Middlewares
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// 🟢 Static route for /uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 🧭 Routes
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

// 🧱 Serve React frontend if build exists
const staticPath = path.join(__dirname, "../frontend/build");

if (fs.existsSync(staticPath)) {
  console.log("✅ Static build folder found at:", staticPath);
  app.use(express.static(staticPath));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(staticPath, "index.html"))
  );
} else {
  console.warn("⚠️ No frontend build found – skipping frontend serving.");
  app.get("/", (req, res) => {
    res.send("🎵 Music Game API is running (no frontend build)");
  });
}

// ❗ Error handlers
app.use(notFound);
app.use(errorHandler);

// 📡 Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketManager(io);

// 🚀 Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
