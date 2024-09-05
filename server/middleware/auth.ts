import jwt from "jsonwebtoken";
import { RequestHandler as Middleware, Request } from "express";

export const SECRET = process.env.JWT_SECRET || "secret";

export const sign = (payload: any) => {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1h",
  });
};

export const verify = (token: string) => {
  return jwt.verify(token, SECRET);
};

export const decode = (token: string) => {
  return jwt.decode(token);
};

export const getToken = (req: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  return token;
};

export const verifyToken = (req: any) => {
  const token = getToken(req);
  if (!token) {
    return null;
  }
  return verify(token);
};

export const authMiddleware: Middleware = (req: any, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  const user = verify(token);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  console.log("user", user);
  // add user to request object
  req.user = user;

  next();
};
