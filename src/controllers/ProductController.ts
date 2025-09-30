import { Request, Response, urlencoded } from "express";
import { AppDataSource } from "src/config/datasource";
import { SimpleConsoleLogger } from "typeorm";
import { Category } from "src/entities/Category"
import { Product } from "src/entities/Product"
import { Store } from "src/entities/Store"

const repo = () => AppDataSource.getRepository(Product)
const storeRepo = () => AppDataSource.getRepository(Store)
const categoryRepo = () => AppDataSource.getRepository(Category)

export class ProductController{

    static async getAll(req: Request, res: Response) {
        const products = await repo().find({ order: { name: "ASC" }})
    
        res.status(200).json(products)
    }
    
    static async getById(req: Request, res: Response) {
        const id: number = Number(req.params.id)
    
        const product = await repo().findOneBy({id})
    
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

    static async create(req:Request, res: Response) {
        const {name, price, stock} = req.body
        const {storeId, categoryId} =req.params

        try {
        const store = await storeRepo().findOneBy({"id": Number(storeId)})
        const category = await categoryRepo().findOneBy({"id": Number(categoryId)})

        if( !store || !category){
            res.status(400).send("Store or Category not Found")
        }

        const product = repo().create({
            "store": store,
            "category": category,
            "name": String(name),
            "price": Number(price),
            "stock": Number(stock),
        })

        await repo().save(product)
        res.status(201).send("Product created")
        } catch (error) {
        res.status(500).send("Contact your sys admin")
        }

    }

    static async update(req: Request, res: Response) {
        const { price, stock, storeId, categoryId } = req.body;
        const { id } = req.params;

        try {
            const product = await repo().findOne({
                where: { id: Number(id) },
                relations: ["store", "category"]
            });

            if (!product) return res.status(404).send("Product not found");

            // Atualiza apenas se o campo foi enviado
            if (price !== undefined) product.price = Number(price);
            if (stock !== undefined) product.stock = Number(stock);

            if (storeId !== undefined) {
                const store = await storeRepo().findOne({ where: { id: Number(storeId) } });
                if (!store) return res.status(404).send("Store not found");
                product.store = store;
            }

            if (categoryId !== undefined) {
                const category = await categoryRepo().findOne({ where: { id: Number(categoryId) } });
                if (!category) return res.status(404).send("Category not found");
                product.category = category;
            }

            await repo().save(product);

            res.status(200).send("Product updated successfully");
        } catch (error) {
            console.error(error);
            res.status(500).send("Contact your sys admin");
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