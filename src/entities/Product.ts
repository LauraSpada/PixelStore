import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./Store";
import { Category } from "./Category";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name: string

    @Column()
    price: number

    @Column()
    stock: number

   
    @ManyToOne(() => Category, category => category.products)
        public category : Category;

}