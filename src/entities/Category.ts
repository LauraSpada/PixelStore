import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id! : number

    @Column()
    name: string

    @Column()
    description: string

    @OneToMany(() => Product, product => product.category)
        public products : Product[];

}