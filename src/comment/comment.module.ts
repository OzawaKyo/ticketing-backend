import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Ticket } from '../ticket/ticket.entity';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Ticket, User]), UserModule, TicketModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
