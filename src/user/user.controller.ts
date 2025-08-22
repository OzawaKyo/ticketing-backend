import { Controller, Get, Post, Body, Param, Delete, UseGuards, UsePipes, ValidationPipe, Put, Patch, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import * as bcrypt from 'bcrypt';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    const hashed = await bcrypt.hash(userData.password, 10);
    const user = await this.userService.create({ ...userData, password: hashed });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto | undefined> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return undefined; // ou throw new BadRequestException('Invalid ID format');
    }
    const user = await this.userService.findOne(numericId);
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<UserResponseDto | undefined> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await this.userService.update(Number(id), userData);
    const user = await this.userService.findOne(Number(id));
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }

  @Patch(':id/role')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async changeRole(@Param('id') id: string, @Body() changeRoleDto: ChangeRoleDto): Promise<UserResponseDto> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new NotFoundException('ID utilisateur invalide');
    }

    const user = await this.userService.changeRole(numericId, changeRoleDto.role);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }
}
