/**
 * Role-based access control middleware
 * Usage: requireRole('Admin') or requireRole('Admin', 'Member')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — requires ${roles.join(' or ')} role`,
      });
    }

    next();
  };
};

module.exports = { requireRole };
