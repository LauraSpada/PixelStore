import { Request, Response, urlencoded } from "express";
import { AppDataSource } from "src/config/datasource";
import { Category } from "src/entities/Category";
import { SimpleConsoleLogger } from "typeorm";

const repo = () => AppDataSource.getRepository(Category)

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

    static async create(req:Request, res: Response) {
        const {name, description} = req.body

        try {
        const createdCategory = repo().create({name, description})
        await repo().save(createdCategory)
        res.status(201).send("User created!")
        } catch (error) {
        console.log(error)
        res.status(500).send("Error while creating new Category")
        }
    }

    static async update(req:Request, res: Response) {
        const id: number = Number(req.params.id)
        const {name} = req.body.name

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