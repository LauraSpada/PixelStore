import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User"; // sua entidade de usuário
import { AppDataSource } from "../config/datasource";

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_super_secreta";

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const { name, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ name, password });
        if (!user) return res.status(401).json({ message: "Usuário ou senha inválidos" });

        const token = jwt.sign({ id: user.id, username: user.name }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
    };
}
