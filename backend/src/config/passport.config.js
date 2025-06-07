import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { NotFoundError } from "../middleware/AppError.js";
import { config } from "./app.config.js";

// Utility to login or create a user (assumed to be implemented)

import { loginOrCreateAccountService } from "../service/Auth.Service.js";

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

        const user = await loginOrCreateAccountService({
          provider: "GOOGLE",
          providerId: googleId,
          displayName: profile.displayName,
          email,
          picture,
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {done(null, user)});
passport.deserializeUser((user, done) => {done(null, user)});