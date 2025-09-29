import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token inválido" });
  }

  next(); // token válido → prossiga
};
