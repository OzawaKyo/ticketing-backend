import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

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
}