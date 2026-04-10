import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";

// Load environment variables first
dotenv.config();

// Import config & models
import sequelize from "./config/database";
import "./models";

// Routes & middlewares
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/error";
import imageOptimizeMiddleware from "./middlewares/imageOptimizer";
import {
  requestLogger,
  errorLogger,
  performanceMonitor,
} from "./middlewares/logger";
import { ENV, Logger } from "./lib";
import { CronService } from "./services/cron.service";

const app = express();
const server = createServer(app);

// ========================
// Middleware Setup
// ========================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: ["https://event-omega-three.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("combined"));
app.use(requestLogger);
app.use(performanceMonitor);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
app.use(imageOptimizeMiddleware); // Apply to all responses

app.use(`${ENV.API_PREFIX}${ENV.API_VERSION}`, routes);

// Error handling (phải đặt sau routes)
app.use(errorLogger);
app.use(notFoundHandler);
app.use(errorHandler);

// ========================
// Graceful Shutdown
// ========================
const gracefulShutdown = async (signal: string) => {
  Logger.info(`${signal} received. Shutting down gracefully...`);

  try {
    await sequelize.close();
    Logger.info("Database connection closed");

    server.close(() => {
      Logger.info("HTTP server closed");
      process.exit(0);
    });

    // Force kill after 10s
    setTimeout(() => {
      Logger.error("Force shutdown after timeout");
      process.exit(1);
    }, 10000);
  } catch (err) {
    Logger.error(`Error during graceful shutdown: ${err}`);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ========================
// Critical Error Handlers
// ========================
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.stack || err}`);
  Logger.error(`Uncaught Exception: ${err.stack || err}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error(`Unhandled Rejection: ${reason}`);
  Logger.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

// ========================
// Core Startup Logic
// ========================
const connectAndStart = async () => {
  const PORT = Number(ENV.PORT) || 8000;
  const HOST = ENV.HOST || "0.0.0.0";

  Logger.info(`Attempting to start server on http://${HOST}:${PORT}`);

  // 1. Database connection
  await sequelize.authenticate();
  Logger.info("Database connected successfully");

  // 2. Initialize Cron Jobs
  CronService.init();

  if (ENV.NODE_ENV === "development") {
    // await sequelize.sync({ alter: true });
    // Logger.info("Database synchronized (dev mode)");
  }

  // 3. Start HTTP server
  await new Promise<void>((resolve, reject) => {
    const httpServer = server.listen(PORT, HOST, () => {
      Logger.info(`Server running at http://${HOST}:${PORT}`);
      Logger.info(`API Base URL: http://${HOST}:${PORT}${ENV.API_PREFIX}${ENV.API_VERSION}`);
      Logger.info(`Environment: ${ENV.NODE_ENV || "development"}`);
      resolve();
    });

    httpServer.once("error", (err: Error & { code?: string }) => {
      if (err.code === "EADDRINUSE") {
        reject(
          new Error(
            `Port ${PORT} is already in use!\n` +
              `   → Run: kill -9 $(lsof -t -i:${PORT})   or change PORT in .env`
          )
        );
      } else {
        reject(err);
      }
    });
  });
};

// ========================
// Main Start Function
// ========================
const startServer = async () => {
  const isProduction = ENV.NODE_ENV === "production" || ENV.NODE_ENV === "staging";

  if (!isProduction) {
    // DEVELOPMENT: Lỗi là chết luôn → nodemon sẽ restart ngay
    await connectAndStart();
    return;
  }

  // PRODUCTION: Retry mãi đến khi thành công (Docker/K8s friendly)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await connectAndStart();
      Logger.info("Server started successfully in production mode");
      break; // Thành công → thoát vòng lặp
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      Logger.error(`Startup failed: ${message}`);
      Logger.warn("Retrying in 5 seconds... (Press Ctrl+C to stop)");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// ========================
// Execute (only when run directly)
// ========================
if (require.main === module) {
  startServer().catch((err) => {
    console.error(`Fatal error: ${err.message || err}`);
    if (err.stack) console.error(err.stack);
    Logger.error(`Fatal error: ${err.message || err}`);
    process.exit(1);
  });
}

export { app, server };