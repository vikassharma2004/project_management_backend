import express from "express";
import passport from "passport";
import { config } from "../config/app.config.js";
import { googleLoginCallback, loginUser, Logout, registeruser } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const authRouter = express.Router();

// Define the failure redirect URL for failed Google login attempts
const failureRedirect = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

authRouter.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"], // Request access to profile and email from Google
  })
);


authRouter.route("/google/callback").get(
  // Authenticate the Google callback response
  passport.authenticate("google", {
    failureRedirect: failureRedirect,
   
  }),

  // Controller to handle post-auth logic (e.g., redirect to workspace)
  googleLoginCallback
);
authRouter.route("/register").post(registeruser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").post(Logout);


export default authRouter;
