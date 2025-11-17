import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name: string

    @Column()
    location: string 

    @OneToMany(() => Category, category => category.store)
        public categories : Category[];
    
    @OneToMany(() => User, user => user.store)
        public users: User[];

}