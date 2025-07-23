import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Ticket } from '../ticket/ticket.entity';
import { User } from '../user/user.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => Ticket, { nullable: false, onDelete: 'CASCADE' })
    ticket: Ticket;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}