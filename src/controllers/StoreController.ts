import { Request, Response, urlencoded } from "express";
import { AppDataSource } from "../config/datasource";
import { SimpleConsoleLogger } from "typeorm";
import { Store } from "../entities/Store"

const repo = () => AppDataSource.getRepository(Store)

export class StoreController {

    static async create(req:Request, res: Response) {
        const {name, location} = req.body

        try {
        const createdStore = repo().create({name, location})
        await repo().save(createdStore)
        res.status(201).json({
            message: "Store created!",
            data: createdStore
        });
        } catch (error) {
        console.log(error)
        res.status(500).send("Error while creating new store")
        }
    }

    static async getAll(req: Request, res: Response) {
        const stores = await repo().find({ order: { name: "ASC" }})

        res.status(200).json(stores)
    }

    static async getById(req: Request, res: Response) {
        const id: number = Number(req.params.id)

        const store = await repo().findOneBy({id})

        try {
        const store = await repo().findOneBy({id})
        if (!store) {
        res.status(404).send("Store not found")
        }

        res.status(200).json(store)
        } catch (error) {
        console.log(error)
        res.status(500).send("Error searching Store" + id)
        }
    
    }

    static async getUsersByStore(req: Request, res: Response) {
        const { storeId } = req.params;

        try {
        const store = await repo().findOne({
            where: { id: Number(storeId) },
            relations: ["users"], 
        });

        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        res.status(200).json({
            message: `Usuários da loja '${store.name}'`,
            data: store.users,
        });
        } catch (error) {
        console.error(error);
        res.status(500).send("Error while fetching users from store");
        }
    }

    static async getProductsByStore(req: Request, res: Response) {
        const { storeId } = req.params;

        try {
            const store = await repo().findOne({
                where: { id: Number(storeId) },
                relations: ["categories", "categories.products"], 
            });

            if (!store) {
                return res.status(404).json({ message: "Store not found" });
            }

            const products = store.categories
                .flatMap(category => category.products || []);

            res.status(200).json({
                message: `Products from store '${store.name}'`,
                data: products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching products from store" });
        }
    }

    static async getCategoriesByStore(req: Request, res: Response) {
        const { storeId } = req.params;

        try {
            const store = await repo().findOne({
                where: { id: Number(storeId) },
                relations: ["categories"], 
            });

            if (!store) {
                return res.status(404).json({ message: "Store not found" });
            }

            const categories = store.categories || [];

            res.status(200).json({
                message: `Categories from store '${store.name}'`,
                data: categories
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching categories from store" });
        }
    }

    static async update(req:Request, res: Response) {
        const { name, location } = req.body;
        const { id } = req.params;

        try {
            const store = await repo().findOneBy({ id: Number(id) });
            if (!store) return res.status(404).json({ message: "Store não encontrada" });

            if (name !== undefined) store.name = name;
            if (location !== undefined) store.location = location;

            const updatedStore = await repo().save(store);

            return res.status(200).json({
            message: "Store updated!",
            data: updatedStore
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Contact your sys admin" });
        }
                
    }

    static async delete(req,res){
        const id: number = Number(req.params.id)

        const store = await repo().findOneBy({id})

        if (!store) {
        res.status(404).send("Store not found")
        }

        try {
        const result = await repo().delete(id)
        res.status(204).send("Store deleted")
        } catch (error) {
        console.log(error)
        res.status(500).send("Error removing Store" + id)
        }
    }

}