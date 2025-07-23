import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, ForbiddenException, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UserService } from '../user/user.service';
import { TicketService } from '../ticket/ticket.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly ticketService: TicketService,
  ) {}

  @Post()
  @Roles('admin', 'user')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createCommentDto: CreateCommentDto, @Query('ticketId') ticketId: number, @Request() req): Promise<CommentResponseDto> {
    const user = await this.userService.findOne(req.user.id);
    if (!user) throw new ForbiddenException('Utilisateur non trouvé');
    const ticket = await this.ticketService.findOne(Number(ticketId));
    if (!ticket) throw new ForbiddenException('Ticket non trouvé');
    const comment = await this.commentService.create({
      content: createCommentDto.content,
      user,
      ticket,
    });
    return {
      id: comment.id,
      content: comment.content,
      userId: user.id,
      ticketId: ticket.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  @Get('ticket/:ticketId')
  @Roles('admin', 'user')
  async findByTicket(@Param('ticketId') ticketId: number): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.findByTicket(Number(ticketId));
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      userId: comment.user?.id,
      ticketId: comment.ticket?.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }

  @Get('user/:userId')
  @Roles('admin')
  async findByUser(@Param('userId') userId: number): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.findByUser(Number(userId));
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      userId: comment.user?.id,
      ticketId: comment.ticket?.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.findAll();
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      userId: comment.user?.id,
      ticketId: comment.ticket?.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: number, @Request() req): Promise<CommentResponseDto> {
    const comment = await this.commentService.findOne(Number(id));
    if (!comment) throw new ForbiddenException('Commentaire non trouvé');
    if (req.user.role !== 'admin' && comment.user?.id !== req.user.id) {
      throw new ForbiddenException('Vous ne pouvez voir que vos propres commentaires.');
    }
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.user?.id,
      ticketId: comment.ticket?.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  @Put(':id')
  @Roles('admin', 'user')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: number, @Body() updateCommentDto: CreateCommentDto, @Request() req): Promise<any> {
    const comment = await this.commentService.findOne(Number(id));
    if (!comment) throw new ForbiddenException('Commentaire non trouvé');
    if (req.user.role !== 'admin' && comment.user?.id !== req.user.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres commentaires.');
    }
    return this.commentService.update(Number(id), { content: updateCommentDto.content });
  }

  @Delete(':id')
  @Roles('admin', 'user')
  async remove(@Param('id') id: number, @Request() req): Promise<any> {
    const comment = await this.commentService.findOne(Number(id));
    if (!comment) throw new ForbiddenException('Commentaire non trouvé');
    if (req.user.role !== 'admin' && comment.user?.id !== req.user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres commentaires.');
    }
    return this.commentService.remove(Number(id));
  }

  // Pagination endpoints
  @Get('ticket/:ticketId/paginated')
  @Roles('admin', 'user')
  async findByTicketWithPagination(
    @Param('ticketId') ticketId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.findByTicketWithPagination(Number(ticketId), Number(page), Number(limit));
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      userId: comment.user?.id,
      ticketId: comment.ticket?.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }

  @Get('user/:userId/paginated')
  @Roles('admin')
  async findByUserWithPagination(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.findByUserWithPagination(Number(userId), Number(page), Number(limit));
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      userId: comment.user?.id,
      ticketId: comment.ticket?.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }

  @Get('paginated')
  @Roles('admin')
  async findAllWithPagination(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.findAllWithPagination(Number(page), Number(limit));
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      userId: comment.user?.id,
      ticketId: comment.ticket?.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }
}
