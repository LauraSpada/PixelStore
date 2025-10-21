import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

export const generateToken = (payload: object, expiresIn: string = "1h"): string => {
 
  return jwt.sign(payload as JwtPayload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
};
