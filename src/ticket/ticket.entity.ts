import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { STATUS } from './ticket.enum';
import { User } from '../user/user.entity';

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

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    createdBy: User;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    assignedTo: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}