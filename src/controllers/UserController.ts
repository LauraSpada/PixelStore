// src/controllers/UserController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/User";
import { Store } from "../entities/Store"

const repo = () => AppDataSource.getRepository(User);
const storeRepo = () => AppDataSource.getRepository(Store)

export class UserController {

    static async create(req: Request, res: Response) {
        const { name, password } = req.body;
        const { storeId } = req.params;

        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required" });
        }

        try {
            const store = await storeRepo().findOneBy({ id: Number(storeId) });

            if (!store) {
            return res.status(404).json({ message: "Store not found" });
            }

            const createdUser = repo().create({
            name,
            password,
            store, 
            });

            await repo().save(createdUser);

            res.status(201).json({
            message: "User created successfully!",
            data: createdUser,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error while creating user");
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const users = await repo().find();
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching users");
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await repo().findOneBy({ id: Number(id) });
            if (!user) return res.status(404).json({ message: "User not found" });

            await repo().remove(user);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error deleting user");
        }
    }
}
