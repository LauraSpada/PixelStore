import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/User";

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_super_secreta";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { name, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ name, password });

      if (!user) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.name },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
}
