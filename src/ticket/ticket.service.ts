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
        const ticket = this.ticketRepository.create(ticketData);
        return this.ticketRepository.save(ticket);
    }

    findAll() {
        return this.ticketRepository.find();
    }

    findOne(id: number) {
        return this.ticketRepository.findOne({ where: { id } });
    }

    update(id: number, ticketData: Partial<Ticket>) {
        return this.ticketRepository.update(id, ticketData);
    }

    remove(id: number) {
        return this.ticketRepository.delete(id);
    }

    findByUser(userId: number) {
        return this.ticketRepository.find({ where: { createdBy: userId } });
    }
}