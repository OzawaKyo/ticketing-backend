import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { STATUS } from './ticket.enum';

@Entity()
export class Ticket {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: STATUS.OPEN })
    status: STATUS;

    @Column({ nullable: true })
    createdBy: number;

    @Column({ nullable: true })
    assignedTo: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}