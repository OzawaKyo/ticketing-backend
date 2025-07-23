import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}
    
    create(commentData: Partial<Comment>) {
        return this.commentRepository.save(commentData);
    }

    findByTicket(ticketId: number) {
        return this.commentRepository.find({
            where: { ticket: { id: ticketId } },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }

    findOne(id: number) {
        return this.commentRepository.findOne({
            where: { id },
            relations: ['user', 'ticket'],
        });
    }

    update(id: number, commentData: Partial<Comment>) {
        return this.commentRepository.update(id, commentData);
    }

    remove(id: number) {
        return this.commentRepository.delete(id);
    }

    findByUser(userId: number) {
        return this.commentRepository.find({
            where: { user: { id: userId } },
            relations: ['ticket'],
            order: { createdAt: 'DESC' },
        });
    }

    findAll() {
        return this.commentRepository.find({
            relations: ['user', 'ticket'],
            order: { createdAt: 'DESC' },
        });
    }

    findByTicketAndUser(ticketId: number, userId: number) {
        return this.commentRepository.find({
            where: { ticket: { id: ticketId }, user: { id: userId } },
            relations: ['user', 'ticket'],
            order: { createdAt: 'DESC' },
        });
    }

    findByTicketAndUserWithPagination(ticketId: number, userId: number, page: number, limit: number) {
        return this.commentRepository.find({
            where: { ticket: { id: ticketId }, user: { id: userId } },
            relations: ['user', 'ticket'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    findByTicketWithPagination(ticketId: number, page: number, limit: number) {
        return this.commentRepository.find({
            where: { ticket: { id: ticketId } },
            relations: ['user'],
            order: { createdAt: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    findByUserWithPagination(userId: number, page: number, limit: number) {
        return this.commentRepository.find({
            where: { user: { id: userId } },
            relations: ['ticket'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }



    findAllWithPagination(page: number, limit: number) {
        return this.commentRepository.find({
            relations: ['user', 'ticket'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    countByTicket(ticketId: number) {
        return this.commentRepository.count({
            where: { ticket: { id: ticketId } },
        });
    }

    countByUser(userId: number) {
        return this.commentRepository.count({
            where: { user: { id: userId } },
        });
    }

    countAll() {
        return this.commentRepository.count();
    }

    countByTicketAndUser(ticketId: number, userId: number) {
        return this.commentRepository.count({
            where: { ticket: { id: ticketId }, user: { id: userId } },
        });
    }
    
}
