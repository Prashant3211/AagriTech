
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: 'Authentication configuration error'
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication token required'
    });
  }

  const token = authHeader.slice(7);

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = verifyToken;
