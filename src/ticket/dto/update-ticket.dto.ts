import { IsString, IsOptional } from 'class-validator';
import { STATUS } from '../ticket.enum';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  status?: STATUS;

  @IsOptional()
  assignedTo?: number;
} 