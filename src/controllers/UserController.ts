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

        if (!name || !password || !storeId) {
            return res.status(400).json({ message: "Name, password and storeId are required" });
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

    static async getById(req: Request, res: Response) {
        const id: number = Number(req.params.id)
    
        const user = await repo().findOneBy({id})
    
        try {
            const user = await repo().findOneBy({id})
            if (!user) {
            res.status(404).send("User not found")
            }
    
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(500).send("Error searching User" + id)
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

    static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, password } = req.body;

    try {
        const user = await repo().findOneBy({ id: Number(id) });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (password) user.password = password;

        const updatedUser = await repo().save(user);

        res.status(200).json({
            message: "User updated successfully!",
            data: updatedUser,
        });
            } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error while updating user" });
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
