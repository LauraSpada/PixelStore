import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/User";

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_super_secreta";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Verifica assinatura do token
    const decoded: any = jwt.verify(token, SECRET_KEY);

    // Verifica se o usuário ainda existe no banco
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.id });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Anexa o user ao request para uso futuro se quiser
    (req as any).user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
