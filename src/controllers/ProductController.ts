import { Request, Response, urlencoded } from "express";
import { AppDataSource } from "../config/datasource";
import { SimpleConsoleLogger } from "typeorm";
import { Category } from "../entities/Category"
import { Product } from "../entities/Product"

const repo = () => AppDataSource.getRepository(Product)
const categoryRepo = () => AppDataSource.getRepository(Category)

export class ProductController{

    static async getAll(req: Request, res: Response) {
        const products = await repo().find({ order: { name: "ASC" }})
    
        res.status(200).json(products)
    }
    
    static async getById(req: Request, res: Response) {
        const id: number = Number(req.params.id)
    
       try {
        const product = await repo().findOneBy({id})
        if (!product) {
          res.status(404).send("Product not found")
        }
    
        res.status(200).json(product)
       } catch (error) {
        console.log(error)
        res.status(500).send("Error searching Product" + id)
       }
    }

    static async create(req: Request, res: Response) {
    const { name, price, stock } = req.body;
    const { categoryId } = req.params;

    try {
        const category = await categoryRepo().findOneBy({ id: Number(categoryId) });

        if (!category) {
            return res.status(400).json({ message: "Category not found" });
        }

        const createdProduct = repo().create({
            name: String(name),
            price: Number(price),
            stock: Number(stock),
            category
        });

        await repo().save(createdProduct);

        res.status(201).json({
            message: "Product created!",
            data: createdProduct
        });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error while creating new product" });
        }
    }

    static async update(req: Request, res: Response) {
        const { name, price, stock } = req.body;
        const { id } = req.params;

        try {
            const product = await repo().findOne({
                where: { id: Number(id) },
                relations: ["category"]
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (name !== undefined) product.name = name;
            if (price !== undefined) product.price = Number(price);
            if (stock !== undefined) product.stock = Number(stock);

            const updatedProduct = await repo().save(product);

            res.status(200).json({
                message: "Product updated!",
                data: updatedProduct
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error while updating product" });
        }
    }

    static async delete(req,res){
        const id: number = Number(req.params.id)

        const product = await repo().findOneBy({id})

        if (!product) {
        res.status(404).send("Product not found")
        }

        try {
        const result = await repo().delete(id)
        res.status(204).send("Product deleted")
        } catch (error) {
        console.log(error)
        res.status(500).send("Error removing Product" + id)
        }
    }

}