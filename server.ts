import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { setupSocket } from "./server/socket";
import { testConnection } from "./database/db";

dotenv.config();

// Import Routes
import authRoutes from "./server/routes/auth";
import userRoutes from "./server/routes/users";
import postRoutes from "./server/routes/posts";
import socialRoutes from "./server/routes/social";
import messageRoutes from "./server/routes/messages";
import notificationRoutes from "./server/routes/notifications";
import adminRoutes from "./server/routes/admin";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Setup Socket.io
  setupSocket(server);

  // Test Database Connection (tanpa memblokir startup jika gagal)
  testConnection().then(success => {
    if (!success) {
      console.warn('⚠️ Server berjalan tanpa koneksi database yang valid.');
    }
  });

  // Middleware Dasar
  app.use(helmet({
    contentSecurityPolicy: false, // Dimatikan agar Vite & CDNs bisa load
  }));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files untuk upload
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/social", socialRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/admin", adminRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SocialHub API is running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
