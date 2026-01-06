const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please login to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    req.user = decoded;
    console.log('User authenticated:', decoded); // Debug log
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please login again' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Checking authorization - Required roles:', roles, 'User role:', req.user.userType); // Debug log
    
    if (!req.user.userType) {
      return res.status(403).json({ success: false, message: 'User role not found. Please login again' });
    }
    
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. This action requires ${roles.join(' or ')} role. Your current role is ${req.user.userType}` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
