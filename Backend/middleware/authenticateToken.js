const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  // 1. Get the Authorization header from the incoming request
  const authHeader = req.header('Authorization');

  // 2. Extract the token from the header (it looks like "Bearer <token>")
  const token = authHeader && authHeader.split(' ')[1];

  // 3. If there's no token, block the request
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    // 4. Verify the token is valid and not expired using your secret key
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. IMPORTANT: Attach the decoded payload (which contains the userId) to the request object
    req.user = decodedPayload; 
    
    // 6. Pass control to the next function in the chain (the route handler)
    next(); 
  } catch (error) {
    // If verification fails (invalid or expired token), block the request
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
