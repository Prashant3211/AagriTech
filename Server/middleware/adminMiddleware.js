
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin only.'
    });
  }

  next();
};

module.exports = requireAdmin;
