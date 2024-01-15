// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");

// Define a middleware function to authenticate with a token
const authenticateWithToken = (req, res, next) => {
  try {
    const SECRET = process.env.JWT_SECRET;
    // Check if the authorization header exists and starts with "Bearer"
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer");

    // Extract the token from the authorization header
    let token = req.headers.authorization.split(" ")[1];

    // If there's no token, return a 401 status code (Unauthorized)
    if (!token) {
      return res.status(401).json({ message: "Access Denied , token missing" });
    }

    // Verify the token with the private key
    jwt.verify(token, SECRET, (err, user) => {
      // If the token is invalid, return a 403 status code (Forbidden)
      if (err) {
        return res.status(403).json({ message: "Invalid Token" });
      }

      // If the token is valid, attach the user to the request object and call the next middleware function
      req.user = user;
      next();
    });
  } catch (error) {
    // If there's an error, return a 500 status code (Internal Server Error)
    res.status(500).json({ message: "Internal server Error !" });
  }
};

// Export the middleware function
module.exports = authenticateWithToken;