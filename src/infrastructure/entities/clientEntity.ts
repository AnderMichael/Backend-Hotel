import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IClientEntity } from "../../domain/entities/IClientEntity";

@Entity()
export class ClientEntity implements IClientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column({ type: "varchar" })
    username!: string;
  
    @Column({ type: "varchar", unique: true })
    email!: string;
    
    @Column({ type: "varchar" })
    hashedPassword!: string;
}
