import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { STATUS } from './ticket.enum';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

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

    @OneToMany(() => Comment, comment => comment.ticket)
    comments: Comment[];
}