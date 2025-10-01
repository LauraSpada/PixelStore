import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { Store } from "../entities/Store";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Store, Product, Category],
  migrations: ['src/migrations/*.ts'],
});