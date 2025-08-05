import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Request() req: any): Promise<UserResponseDto | undefined> {
    const user = await this.userService.findOne(req.user.id);
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }
}
