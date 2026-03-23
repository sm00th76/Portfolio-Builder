import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config';
import { signup, login, getMe } from "./server/routes/auth.js";
import { protect } from "./server/middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 5003;

  // Connect to MongoDB
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
    }
  } else {
    console.warn('⚠️ MONGO_URI not set - skipping MongoDB connection');
  }

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
    credentials: true
  }));

  // 👇 ADDED: Cross-Origin Isolation Headers for WebContainers 👇
  // This is required to enable SharedArrayBuffer in the browser
  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });
  // 👆 ---------------------------------------------------- 👆

  app.use(express.json({ limit: '50mb' }));

  // Auth routes
  app.post('/api/auth/signup', signup);
  app.post('/api/auth/login', login);
  app.get('/api/auth/me', protect, getMe);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();