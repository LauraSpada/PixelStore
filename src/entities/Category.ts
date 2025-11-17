import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./Store";
import { Product } from "./Product";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id! : number

    @Column()
    name: string

    @Column()
    description: string
  
    @ManyToOne(() => Store, store => store.categories)
    public store: Store;

    @OneToMany(() => Product, product => product.category)
        public products : Product[];
        
}