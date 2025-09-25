import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ quite: true });

const checkAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  if (token === process.env.SERVICE_TOKEN) 
    return next()

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });
    req.user = decoded;
    next();
  });
};

export default checkAuth;
