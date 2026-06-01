import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1. token get karo header se
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 2. token format: "Bearer token"
    const actualToken = token.split(" ")[1];

    // 3. verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // 4. user ko request me attach karo
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;