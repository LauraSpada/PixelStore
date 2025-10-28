import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name: string

    @Column()
    location: string 

    @OneToMany(() => Product, product => product.store)
        public products: Product[];
    
    @OneToMany(() => User, user => user.store)
        public users: User[];

}