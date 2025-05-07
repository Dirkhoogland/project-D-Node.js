import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // adjust path if needed
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth') // Adds Swagger tag for grouping
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Fake login logic (replace with real user check)
    if (username === 'admin' && password === 'admin') {
      return this.authService.login({ id: 1, username });
    }

    return { message: 'Invalid credentials' };
  }
}