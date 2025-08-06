import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Request, ForbiddenException, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { STATUS } from './ticket.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
        private readonly userService: UserService,
    ) {}

    @Post()
    @Roles('admin', 'user')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
        const user = await this.userService.findOne(req.user.id);
        if (!user) throw new ForbiddenException('Utilisateur non trouvé');
        let assignedToUser: User | undefined = undefined;
        if (createTicketDto.assignedTo) {
            assignedToUser = await this.userService.findOne(createTicketDto.assignedTo) || undefined;
        }
        return this.ticketService.create({
            ...createTicketDto,
            createdBy: user,
            assignedTo: assignedToUser,
        });
    }

    @Get()
    @Roles('admin', 'user')
    findAll(
        @Request() req,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('assignedTo') assignedTo?: string,
        @Query('createdAfter') createdAfter?: string,
        @Query('createdBefore') createdBefore?: string,
    ) {
        const isAdmin = req.user.role === 'admin';
        return this.ticketService.searchAndFilter({
            search,
            status: status as STATUS,
            assignedTo: assignedTo ? Number(assignedTo) : undefined,
            createdAfter,
            createdBefore,
            userId: req.user.id,
            isAdmin,
        });
    }

    @Get(':id')
    @Roles('admin', 'user')
    async findOne(@Param('id') id: string, @Request() req) {
        const ticket = await this.ticketService.findOne(Number(id));
        if (!ticket) throw new ForbiddenException('Ticket non trouvé');
        if (req.user.role !== 'admin' && ticket.createdBy.id !== req.user.id) {
            throw new ForbiddenException('Vous ne pouvez voir que vos propres tickets.');
        }
        return ticket;
    }

    @Put(':id')
    @Roles('admin')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Request() req) {
        const ticket = await this.ticketService.findOne(Number(id));
        if (!ticket) throw new ForbiddenException('Ticket non trouvé');
        let assignedToUser: User | undefined = ticket.assignedTo;
        if (updateTicketDto.assignedTo) {
            assignedToUser = await this.userService.findOne(updateTicketDto.assignedTo) || undefined;
        }
        return this.ticketService.update(Number(id), {
            ...updateTicketDto,
            assignedTo: assignedToUser,
        });
    }

    @Delete(':id')
    @Roles('admin', 'user')
    async remove(@Param('id') id: string, @Request() req) {
        const ticket = await this.ticketService.findOne(Number(id));
        if (!ticket) throw new ForbiddenException('Ticket non trouvé');
        if (req.user.role !== 'admin' && ticket.createdBy.id !== req.user.id) {
            throw new ForbiddenException('Vous ne pouvez supprimer que vos propres tickets.');
        }
        return this.ticketService.remove(Number(id));
    }
}

        