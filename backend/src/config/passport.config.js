import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { NotFoundError } from "../middleware/AppError.js";
import { config } from "./app.config.js";

// Utility to login or create a user (assumed to be implemented)

import { loginOrCreateAccountService } from "../service/Auth.Service.js";
import { VerifyUserService } from "../service/Auth.Service.js";
import { User } from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;

        if (!googleId) {
          return done(new NotFoundError("Google ID is missing"), null);
        }
        console.log("profile", profile);
        const user = await loginOrCreateAccountService({
          provider: "GOOGLE",
          providerId: googleId,
          displayName: profile.displayName,
          email,
          picture,
        });
        console.log("before done");
        return done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy verify:", error);
        return done(error, false);
      }
    }
  )
);

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
      passReqToCallback: true, // ✅ This tells Passport to pass `req` as the first argument
    },
    async (req, email, password, done) => {
      // ✅ `req` must be the first parameter
      try {
        // console.log("✅ Inside LocalStrategy");
        // console.log("req.body in strategy:", req.body);
        // console.log("Parsed email:", email);
        // console.log("Parsed password:", password);
        const user = await VerifyUserService({
          email,
          password,
        });
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error?.message });
      }
    }
  )
);

// Save only the user ID in the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// On each request, fetch the user by ID and exclude the password
passport.deserializeUser(async (id, done) => {
  try {
   
    const user = await User.findById(id).select('-password');
    if (!user) return done(null, false); // User not found
    done(null, user);
  } catch (err) {
    done(err);
  }
});
