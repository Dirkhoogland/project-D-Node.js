import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordUsername } from './password.entity'; // Assuming you have an entity for the table
import { Role } from './Roles/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(PasswordUsername)
    private readonly passwordUsernameRepository: Repository<PasswordUsername>,
  ) { }

  async findUserByUsername(Username: string): Promise<{ Username: string; hashedPassword: string; Role: Role } | null> {
    const user = await this.passwordUsernameRepository.findOne({ where: { Username } });
    if (!user) {
      return null;
    }
    return {
      Username: user.Username,
      hashedPassword: user.Password,
      Role: user.Role, // Include role
    };
  }

  async register({ username, password, role }: { username: string; password: string; role?: Role }): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = this.passwordUsernameRepository.create({
    Username: username,
    Password: hashedPassword,
    Role: role ?? Role.USER, // default only if role is missing
  });
  await this.passwordUsernameRepository.save(newUser);
}


  async validateUser(Username: string, password: string): Promise<boolean> {
    const user = await this.findUserByUsername(Username);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.hashedPassword);
  }

  login(user: { Username: string; Role: Role }) {
    return this.jwtService.sign({
      username: user.Username,
      role: user.Role, // Include role in JWT payload
    });
  }
}