// Wraps an async route handler and forwards any thrown error to next()
export const asyncWrapper = (controllerFn) => {
  return (req, res, next) => {
    Promise.resolve(controllerFn(req, res, next)).catch(next);
  };
};
