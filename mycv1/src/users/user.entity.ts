import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {Report} from "../reports/report.entity";
// import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    // @Exclude()
    password: string;

    @Column({default: true})
    admin: boolean;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];
}