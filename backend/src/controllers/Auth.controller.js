import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { config } from "../config/app.config.js";

import { registerSchema } from "../validation/auth.validation.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { RegisterUserService } from "../service/Auth.Service.js";
import passport from "passport";

/**
 * Handles the Google OAuth callback after successful authentication.
 * Redirects the user to the appropriate frontend route based on their workspace.
 */
export const googleLoginCallback = catchAsyncError((req, res) => {
  // Get the current workspace from the authenticated user object
  const currentWorkspace = req.user?.currentWorkspace;

  // If no workspace is found, redirect to failure page with status query
  if (!currentWorkspace) {
    return res.redirect(
      `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
    );
  }

  // If workspace is present, redirect user to their workspace dashboard on frontend
  return res.redirect(
    `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
  );
});

export const registeruser = catchAsyncError(async (req, res, next) => {
  const body = registerSchema.parse(req.body);
  // if nay zoderror occurs it is handled by errormidleware in middleware
  await RegisterUserService(body);

  res.status(HTTPSTATUS.OK).json({ message: "Account created successfully" });
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  // console.log("📥 Login controller hit");
  // console.log("Login request body:", req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: info?.message || "login failed",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // If omitPassword is a method on user (make sure it's synchronous)
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(HTTPSTATUS.OK).json({
        message: "Login successful",
        user: userObj,
      });
    });
  })(req, res, next); // ← important: invoke the returned middleware
});

export const Logout = catchAsyncError(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid");
      res.clearCookie("session"); // default session cookie name
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});
