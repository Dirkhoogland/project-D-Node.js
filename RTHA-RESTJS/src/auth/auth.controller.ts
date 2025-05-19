import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // adjust path if needed
import { ApiBody, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth') // Adds Swagger tag for grouping
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Check if the user exists in the database
    const user = await this.authService.findUserByUsername(username);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Validate the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate and return a JWT token
    return this.authService.login({ username: user.Username });
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto.username, registerDto.password);
    return { message: 'User registered successfully' };
  }
} 