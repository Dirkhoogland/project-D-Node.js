import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // adjust path if needed
import { ApiBody, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { RegisterDto } from './dto/register.dto';
import { Role } from './Roles/role.enum'; // Adjust the import path as necessary
import { Roles } from './Roles/role.decorator'
import { RolesGuard } from './Roles/role.guard';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';


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
    return this.authService.login({ Username: user.Username, Role: user.Role });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('register')
  @ApiBearerAuth('jwt')
  @Roles(Role.ADMIN)
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return { message: 'User registered successfully' };
  }
} 