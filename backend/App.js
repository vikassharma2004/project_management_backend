import express from "express"; // Importing Express.js to create the server
import dotenv from "dotenv"; // Loads environment variables from .env file
import cors from "cors"; // CORS middleware to handle cross-origin requests
import session from "express-session"; // Session middleware using cookies for managing sessions
import { config } from "./src/config/app.config.js"; // Importing configuration object (environment variables)
import { connectDB } from "./src/config/database.config.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import { HTTPSTATUS } from "./src/config/http.config.js";
import { catchAsyncError } from "./src/middleware/asyncErrorHandler.js";
import "../backend/src/config/passport.config.js"
import passport from "passport";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import { isAuthenticated } from "./src/middleware/isAuthenticated.js";
import workspaceRouter from "./src/routes/workspace.route.js";
import MemberRouter from "./src/routes/member.route.js";
import ProjectRouter from "./src/routes/project.route.js"

dotenv.config(); // Load environment variables from .env file
const BASE_PATH = config.BASE_PATH; // Optional: BASE_PATH for route prefixing (not used in this snippet)

const app = express(); // Creating the Express application

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (form submissions, etc.)
app.use(express.urlencoded({ extended: true }));

// Log every incoming request with method, path, headers, and body
app.use((req, res, next) => {
  console.log("🔍 Incoming Request:");
  console.log("Method:", req.method);
  console.log("Path:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body); // May be undefined if body-parsing is missing
  next();
});

// Session middleware configuration
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name:"session",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: config.NODE_ENV === "production",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
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
app.use(`${BASE_PATH}/auth`,authRouter);
app.use(`${BASE_PATH}/user`,isAuthenticated,userRouter);
app.use(`${BASE_PATH}/workspace`,isAuthenticated,workspaceRouter);
app.use(`${BASE_PATH}/member`,isAuthenticated,MemberRouter);
app.use(`${BASE_PATH}/project`,isAuthenticated,ProjectRouter);
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
