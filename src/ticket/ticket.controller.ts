import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Request, ForbiddenException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Ticket } from './ticket.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @Post()
    @Roles('admin', 'user')
    create(@Body() ticketData: Partial<Ticket>, @Request() req) {
        // Associer le ticket à l'utilisateur connecté
        return this.ticketService.create({ ...ticketData, createdBy: req.user.id });
    }

    @Get()
    @Roles('admin', 'user')
    findAll(@Request() req) {
        if (req.user.role === 'admin') {
            return this.ticketService.findAll();
        } else {
            return this.ticketService.findByUser(req.user.id);
        }
    }

    @Get(':id')
    @Roles('admin', 'user')
    async findOne(@Param('id') id: string, @Request() req) {
        const ticket = await this.ticketService.findOne(Number(id));
        if (!ticket) throw new ForbiddenException('Ticket non trouvé');
        if (req.user.role !== 'admin' && ticket.createdBy !== req.user.id) {
            throw new ForbiddenException('Vous ne pouvez voir que vos propres tickets.');
        }
        return ticket;
    }

    @Put(':id')
    @Roles('admin', 'user')
    async update(@Param('id') id: string, @Body() ticketData: Partial<Ticket>, @Request() req) {
        const ticket = await this.ticketService.findOne(Number(id));
        if (!ticket) throw new ForbiddenException('Ticket non trouvé');
        if (req.user.role !== 'admin' && ticket.createdBy !== req.user.id) {
            throw new ForbiddenException('Vous ne pouvez modifier que vos propres tickets.');
        }
        return this.ticketService.update(Number(id), ticketData);
    }

    @Delete(':id')
    @Roles('admin', 'user')
    async remove(@Param('id') id: string, @Request() req) {
        const ticket = await this.ticketService.findOne(Number(id));
        if (!ticket) throw new ForbiddenException('Ticket non trouvé');
        if (req.user.role !== 'admin' && ticket.createdBy !== req.user.id) {
            throw new ForbiddenException('Vous ne pouvez supprimer que vos propres tickets.');
        }
        return this.ticketService.remove(Number(id));
    }
}

        