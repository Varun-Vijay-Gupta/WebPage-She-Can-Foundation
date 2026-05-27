function errorHandler(err, _req, res, _next) {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err.message || "Internal server error";

  // Keep error format consistent for frontend.
  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = { errorHandler };

