import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }
  
  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  
  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
