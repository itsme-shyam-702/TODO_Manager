export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  // Mongoose: duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `${field} already exists`;
    statusCode = 409;
  }

  // Mongoose: invalid ObjectId
  if (err.name === "CastError") {
    message    = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // Zod validation error
  if (err.name === "ZodError") {
    const errors = err.errors.map((e) => ({
      field:   e.path.join("."),
      message: e.message,
    }));
    return res.status(422).json({ message: "Validation failed", errors });
  }

  res.status(statusCode).json({ message });
}
