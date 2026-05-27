const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const contactRoutes = require("./routes/contactRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFoundHandler } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Basic hardening for production.
app.use(helmet());

// Logging (use lighter format on production).
app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));

app.use(express.json({ limit: "200kb" }));

// CORS: allow common local dev URLs (Live Server, VS Code, etc.)
const defaultDevOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

function corsOriginCheck(origin, callback) {
  // Allow requests with no origin (Postman, server-to-server)
  if (!origin) return callback(null, true);

  const fromEnv = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : [];

  const allowed =
    fromEnv.length > 0
      ? fromEnv
      : process.env.NODE_ENV === "production"
        ? []
        : defaultDevOrigins;

  // In development, allow any localhost / 127.0.0.1 port
  if (process.env.NODE_ENV !== "production") {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
  }

  if (allowed.includes(origin) || allowed.includes("*")) {
    return callback(null, true);
  }

  callback(null, false);
}

app.use(
  cors({
    origin: corsOriginCheck,
    credentials: false,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/contact", contactRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/admin", adminRoutes);

// Optional: serve admin dashboard from backend during local dev
app.use("/admin", express.static(path.join(__dirname, "../frontend/admin")));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

