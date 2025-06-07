// config/app-config.js

import getEnv from "../utils/get-env.js";

const AppConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT",4000 ),
BASE_PATH: getEnv("BASE_PATH", "/api"),
  // MongoDB
  MONGO_URI: getEnv("MONGO_URI"," " ),

  // Session
  SESSION_SECRET: getEnv("SESSION_SECRET", "session_secret_key"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN", "1d"),

  // JWT
  JWT_SECRET: getEnv("JWT_SECRET", "jwt_secret_key"), // optional fallback

  // Google OAuth
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", ""),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL", ""),

  // Frontend URLs
  FRONTEND_ORIGIN: getEnv("FORNTEND_ORIGIN", "http://localhost:5173"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_CALLBACK_URL", "http://localhost:5173/google/oauth/callback"),
});

export const config=AppConfig();
