import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

// Gera token JWT
export const generateToken = (payload: object, expiresIn: string = "1h"): string => {
  // Forçamos o tipo para JwtPayload para evitar erro de TS
  return jwt.sign(payload as JwtPayload, JWT_SECRET, { expiresIn });
};

// Verifica token JWT
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
};
