import express from "express"; // Importing Express.js to create the server
import dotenv from "dotenv"; // Loads environment variables from .env file
import cors from "cors"; // CORS middleware to handle cross-origin requests
import session from "cookie-session"; // Session middleware using cookies for managing sessions
import { config } from "./src/config/app.config.js"; // Importing configuration object (environment variables)
import { connectDB } from "./src/config/database.config.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import { HTTPSTATUS } from "./src/config/http.config.js";
import { catchAsyncError } from "./src/middleware/asyncErrorHandler.js";
import { ValidationError } from "./src/middleware/AppError.js";

dotenv.config(); // Load environment variables from .env file
const BASE_PATH = config.BASE_PATH; // Optional: BASE_PATH for route prefixing (not used in this snippet)

const app = express(); // Creating the Express application

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (form submissions, etc.)
app.use(express.urlencoded({ extended: true }));

// Session middleware configuration
app.use(
  session({
    name: "session", // Name of the cookie
    keys: [config.SESSION_SECRET], // Secret key(s) to sign the session ID cookie
    maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
    secure: config.NODE_ENV === "production", // Use HTTPS-only cookie in production
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: "lax", // CSRF protection: cookie sent on same-site requests or top-level navigation
  })
);

// CORS configuration to allow frontend origin and credentials (cookies)
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN, // Allow requests from frontend origin
    credentials: true, // Allow cookies to be sent
  })
);

// Simple GET route for testing server
app.get(
  "/",
  catchAsyncError((req, res, next) => {
    res
      .status(HTTPSTATUS.OK)
      .json({ message: `server is running and hit by IPaddress ${req.ip}` });
  })
);
// Catch unknown routes (404)
app.use((req, res, next) => {
  const error = new Error(` Route Not Found for path  - ${req.originalUrl}`);

  error.statusCode = HTTPSTATUS.NOT_FOUND;
  next(error);
});

// middleware
app.use(errorHandler);

// Starting the Express server on configured port
const server = app.listen(config.PORT, async () => {
  console.log(`Server is running on port http://localhost:${config.PORT}`);
  await connectDB();
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥", err);
  process.exit(1); // exit immediately
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err);
  server.close(() => process.exit(1)); // gracefully close server then exit
});
