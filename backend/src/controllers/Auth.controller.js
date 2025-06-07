import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { config } from "../config/app.config.js";

/**
 * Handles the Google OAuth callback after successful authentication.
 * Redirects the user to the appropriate frontend route based on their workspace.
 */
export const googleLoginCallback = catchAsyncError((req, res) => {
  // Get the current workspace from the authenticated user object
  const currentWorkspace = req.user?.currentWorkspace;

  // If no workspace is found, redirect to failure page with status query
  if (!currentWorkspace) {
    return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
  }

  // If workspace is present, redirect user to their workspace dashboard on frontend
  return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
});
