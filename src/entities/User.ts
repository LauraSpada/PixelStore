import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Store } from "./Store";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string; // hash da senha

  @ManyToOne(() => Store, store => store.users)
    public store: Store;
    
}
