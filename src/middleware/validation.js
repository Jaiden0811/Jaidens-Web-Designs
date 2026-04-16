// Authentication Middleware
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No authorization token' });
  }

  try {
    // This would validate the JWT token
    // For Firebase, we verify the token using admin SDK
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: message,
    status
  });
};

// CORS middleware is already handled in server.js
// This is additional middleware for request logging
export const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

// Validation middleware
export const validateOrderData = (req, res, next) => {
  const { name, email, phone, description, paymentMethod } = req.body;
  
  if (!name || !email || !phone || !description || !paymentMethod) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, phone, description, paymentMethod'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

// Contact form validation
export const validateContactData = (req, res, next) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, message'
    });
  }

  next();
};
