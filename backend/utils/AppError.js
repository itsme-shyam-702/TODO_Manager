export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;   // helps distinguish known vs unknown errors
    Error.captureStackTrace(this, this.constructor);
  }
}
