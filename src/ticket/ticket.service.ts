import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { STATUS } from './ticket.enum';
import { Between, Like } from 'typeorm';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepository: Repository<Ticket>,
    ) {}

    create(ticketData: Partial<Ticket>) {
        // ticketData.createdBy et ticketData.assignedTo doivent être des objets User ou des ids
        return this.ticketRepository.save(ticketData);
    }

    findAll() {
        return this.ticketRepository.find({ relations: ['createdBy', 'assignedTo', 'comments', 'comments.user'] });
    }

    findOne(id: number) {
        return this.ticketRepository.findOne({ where: { id }, relations: ['createdBy', 'assignedTo', 'comments', 'comments.user'] });
    }

    update(id: number, ticketData: Partial<Ticket>) {
        return this.ticketRepository.update(id, ticketData);
    }

    remove(id: number) {
        return this.ticketRepository.delete(id);
    }

    findByUser(userId: number) {
        return this.ticketRepository.find({ where: { createdBy: { id: userId } }, relations: ['createdBy', 'assignedTo'] });
    }

    async searchAndFilter({
        search,
        status,
        assignedTo,
        createdAfter,
        createdBefore,
        userId,
        isAdmin
    }: {
        search?: string;
        status?: STATUS;
        assignedTo?: number;
        createdAfter?: string;
        createdBefore?: string;
        userId?: number;
        isAdmin?: boolean;
    }) {
        const qb = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.createdBy', 'createdBy')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
            .leftJoinAndSelect('ticket.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'commentUser');

        if (!isAdmin && userId) {
            qb.andWhere('ticket.createdBy = :userId', { userId });
        }
        if (search) {
            qb.andWhere('(ticket.title ILIKE :search OR ticket.description ILIKE :search)', { search: `%${search}%` });
        }
        if (status) {
            qb.andWhere('ticket.status = :status', { status });
        }
        if (assignedTo) {
            qb.andWhere('ticket.assignedTo = :assignedTo', { assignedTo });
        }
        if (createdAfter) {
            qb.andWhere('ticket.createdAt >= :createdAfter', { createdAfter });
        }
        if (createdBefore) {
            qb.andWhere('ticket.createdAt <= :createdBefore', { createdBefore });
        }
        qb.orderBy('ticket.createdAt', 'DESC');
        return qb.getMany();
    }
}