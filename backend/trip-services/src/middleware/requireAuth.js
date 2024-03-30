const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  // Extract the token from the Authorization header
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the payload to the request object
    req.user = decoded;
    
    // Call next to proceed to the controller function
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Token invalid' });
  }
};

module.exports = requireAuth;
