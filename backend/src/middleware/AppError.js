import { HTTPSTATUS } from "../config/http.config.js";

class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", errorCode = "NOT_FOUND") {
    super(message, HTTPSTATUS.NOT_FOUND, errorCode);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access", errorCode = "UNAUTHORIZED") {
    super(message, HTTPSTATUS.UNAUTHORIZED, errorCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access", errorCode = "FORBIDDEN") {
    super(message, HTTPSTATUS.FORBIDDEN, errorCode);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errorCode = "BAD_REQUEST") {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode = "INTERNAL_SERVER_ERROR"
  ) {
    super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode);
  }
}

export class DuplicateFieldError extends AppError {
  constructor(field = "field", errorCode = "DUPLICATE_FIELD") {
    super(`Duplicate ${field} entered`, HTTPSTATUS.BAD_REQUEST, errorCode);
  }
}

export class ValidationError extends AppError {
  constructor(messages = [], errorCode = "VALIDATION_ERROR") {
    const message = Array.isArray(messages)
      ? messages.join(". ")
      : String(messages);
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode);
  }
}

export class InvalidTokenError extends AppError {
  constructor(errorCode = "INVALID_TOKEN") {
    super(
      "Invalid token. Please log in again.",
      HTTPSTATUS.UNAUTHORIZED,
      errorCode
    );
  }
}

export class TokenExpiredError extends AppError {
  constructor(errorCode = "TOKEN_EXPIRED") {
    super(
      "Token expired. Please log in again.",
      HTTPSTATUS.UNAUTHORIZED,
      errorCode
    );
  }
}
