import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ActionLogService } from '../database/action-log.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly actionLogService: ActionLogService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    const startTime = Date.now();
    try {
      const result = await this.authService.login(loginDto);
      
      // Log successful login action
      await this.actionLogService.log({
        actionType: 'login',
        userId: result.user.id,
        username: result.user.username,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        userRole: result.user.roles?.[0]?.role?.name || 'user',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: true,
        inputData: { username: loginDto.username },
        outputData: { userId: result.user.id, accessToken: '[REDACTED]' },
        duration: Date.now() - startTime,
      });
      
      return result;
    } catch (error) {
      // Log failed login action
      await this.actionLogService.log({
        actionType: 'login',
        userId: 0,
        username: 'unknown',
        firstName: 'unknown',
        lastName: 'unknown',
        userRole: 'guest',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: false,
        inputData: { username: loginDto.username },
        errorMessage: error.message,
        errorCode: error.status?.toString() || '401',
        duration: Date.now() - startTime,
      });
      
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto, @Request() req) {
    const startTime = Date.now();
    try {
      const result = await this.authService.register(registerDto);
      
      // Log successful registration action
      await this.actionLogService.log({
        actionType: 'register',
        userId: result.id,
        username: result.username,
        firstName: result.firstName,
        lastName: result.lastName,
        userRole: result.roles?.[0]?.role?.name || 'user',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: true,
        inputData: { 
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName 
        },
        outputData: { userId: result.id },
        resourceType: 'user',
        resourceId: result.id.toString(),
        duration: Date.now() - startTime,
      });
      
      return result;
    } catch (error) {
      // Log failed registration action
      await this.actionLogService.log({
        actionType: 'register',
        userId: 0,
        username: 'unknown',
        firstName: 'unknown',
        lastName: 'unknown',
        userRole: 'guest',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: false,
        inputData: { 
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName 
        },
        errorMessage: error.message,
        errorCode: error.status?.toString() || '400',
        duration: Date.now() - startTime,
      });
      
      throw error;
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
}
