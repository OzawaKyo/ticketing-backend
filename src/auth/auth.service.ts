import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: {
    prenom: string;
    nom: string;
    email: string;
    password: string;
  }) {
    const existingUser = await this.userService.findByEmail(data.email);
  if (existingUser) {
    throw new BadRequestException('Cet email est déjà utilisé.');
  }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userService.create({
      ...data,
      password: hashed,
    });

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    return this.generateToken(user.id, user.email, user.role);
  }

  private generateToken(id: number, email: string, role: string) {
    const payload = { sub: id, email, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
