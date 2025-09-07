import { Controller, Post, Body, UseGuards, Get, Request, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { handleAppError } from '../../common/utils/error-handler';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @Audit('user_login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid credentials or email not verified' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      handleAppError(error);
    }
  }

  @Post('register')
  @Audit('user_registration')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - User with this email already exists' })
  async register(@Body() registerDto: RegisterDto, @Request() req) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      handleAppError(error);
    }
  }

  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('verify-email')
  @Audit('email_verification')
  @ApiOperation({ summary: 'Verify email with JWT token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid or expired token' })
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }
    try {
      return await this.authService.verifyEmail(token);
    } catch (error) {
      handleAppError(error);
    }
  }
}