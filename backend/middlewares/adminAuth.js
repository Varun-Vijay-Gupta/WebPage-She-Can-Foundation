function adminAuth(req, res, next) {
  const apiKey = req.headers["x-admin-key"];
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return res.status(503).json({
      success: false,
      error: "Admin API key is not configured on the server.",
    });
  }

  if (!apiKey || apiKey !== expected) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Invalid admin key.",
    });
  }

  return next();
}

module.exports = { adminAuth };
