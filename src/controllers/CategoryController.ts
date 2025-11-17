import { Request, Response, urlencoded } from "express";
import { AppDataSource } from "../config/datasource";
import { Category } from "../entities/Category";
import { SimpleConsoleLogger } from "typeorm";
import { Store } from "src/entities/Store";

const repo = () => AppDataSource.getRepository(Category)
const storeRepo = () => AppDataSource.getRepository(Store)

export class CategoryController {

    static async getAll(req: Request, res: Response) {
        const categories = await repo().find({ order: { name: "ASC" }})

        res.status(200).json(categories)
    }

    static async getById(req: Request, res: Response) {
        const id: number = Number(req.params.id)

        const category = await repo().findOneBy({id})

        try {
        const category = await repo().findOneBy({id})
        if (!category) {
        res.status(404).send("Category not found")
        }

        res.status(200).json(category)
        } catch (error) {
        console.log(error)
        res.status(500).send("Error searching Category" + id)
        }
    
    }

    static async getProductsByCategory(req: Request, res: Response) {
        const { categoryId } = req.params;

        try {
            const category = await repo().findOne({
            where: { id: Number(categoryId) },
            relations: ["products"], 
            });

            if (!category) {
            return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({
            message: `Products from category '${category.name}'`,
            data: category.products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching products from category" });
        }
    }

    static async create(req: Request, res: Response) {
        const { name, description } = req.body;
        const { storeId } = req.params;

        if (!name || !description || !storeId) {
            return res.status(400).json({ message: "Name, description and storeId are required" });
        }

        try {
            const store = await storeRepo().findOneBy({ id: Number(storeId) });

            if (!store) {
            return res.status(404).json({ message: "Store not found" });
            }

            const createdCategory = repo().create({
            name,
            description,
            store, 
            });

            await repo().save(createdCategory);

            res.status(201).json({
            message: "Category created successfully!",
            data: createdCategory,
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).send("Error while creating Category");
        }
    }

    static async update(req:Request, res: Response) {
        const id: number = Number(req.params.id)
        const {name} = req.body

        if (!name) {
        res.status(404).send("Name not found")
        }

        const category = await repo().findOneBy({id})

        if (!category) {
        res.status(404).send("Category not found")
        }

        try {
        category.name = name
        const savedCategory = await repo().save(category)
        res.status(200).send("Category updated")
        } catch (error) {
        console.log(error)
        res.status(500).send("Error updating Category" + id)
        }
    }

    static async delete(req,res){
        const id: number = Number(req.params.id)

        const category = await repo().findOneBy({id})

        if (!category) {
        res.status(404).send("Category not found")
        }

        try {
        const result = await repo().delete(id)
        res.status(204).send("Category deleted")
        } catch (error) {
        console.log(error)
        res.status(500).send("Error removing Category" + id)
        }
    }

}