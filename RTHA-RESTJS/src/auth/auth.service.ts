import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordUsername } from './password.entity'; // Assuming you have an entity for the table

// test123333
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(PasswordUsername)
    private readonly passwordUsernameRepository: Repository<PasswordUsername>,
  ) {}

  async findUserByUsername(Username: string): Promise<{Username: string; hashedPassword: string } | null> {
    const user = await this.passwordUsernameRepository.findOne({ where: { Username } });
    if (!user) {
      return null;
    }
    const bcrypt = require('bcrypt');
    bcrypt.hash('Admin', 10).then(console.log);
    return {
      Username: user.Username,
      hashedPassword: user.Password,
    };
  }

  async register(Username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.passwordUsernameRepository.create({ Username, Password: hashedPassword });
    await this.passwordUsernameRepository.save(newUser);
  }

  async validateUser(Username: string, password: string): Promise<boolean> {
    const user = await this.findUserByUsername(Username);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.hashedPassword);
  }

  login(payload: { Username: string; Password: string }) {
    return this.jwtService.sign(payload);
  }
}