import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { User } from "../entities/User";

export const router = Router();

// Usuário de exemplo
const fakeUser: User = {
  id: 1,
  name: "admin",
  password: "$2b$10$tKUKDXmvXuvyzVCFxcARdu3m2kwKBsShxBcYo4ybxG94X49Pfoope" // senha: "123456"
};

// endpoint de login
router.post("/login", async (req: Request, res: Response) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
  }

  if (name !== fakeUser.name) {
    return res.status(401).json({ message: "Usuário ou senha inválidos" }); 
  }

  const isPasswordValid = await bcrypt.compare(password, fakeUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Usuário ou senha inválidos" }); 
  }

  const token = generateToken({ id: fakeUser.id, name: fakeUser.name });
  return res.json({ token });
});