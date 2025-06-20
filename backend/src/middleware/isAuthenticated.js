import { UnauthorizedError } from "./AppError.js";

export const isAuthenticated = (req, res, next) => {
  
  if (req.isAuthenticated && req.isAuthenticated()) {
    // User is authenticated, proceed to next middleware/route
    return next();
  }
  
  // User is NOT authenticated
throw new UnauthorizedError("Unauthorized access");
};
