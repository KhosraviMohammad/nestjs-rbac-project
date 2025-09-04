import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { MainDatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: MainDatabaseService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with roleType
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        roleType: createUserDto.role || 'support', // Use roleType instead of roles
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateEmailVerification(userId: number, verified: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: verified,
        emailVerifiedAt: verified ? new Date() : null,
      },
    });
  }

  async lockUser(id: number) {
    const user = await this.findById(id);
    
    if (!user.isActive) {
      throw new BadRequestException('User is already locked');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async unlockUser(id: number) {
    const user = await this.findById(id);
    
    if (user.isActive) {
      throw new BadRequestException('User is already unlocked');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  async changeUserRole(userId: number, roleType: string) {
    // Validate role type
    if (!['admin', 'support'].includes(roleType)) {
      throw new BadRequestException('Invalid role type. Must be "admin" or "support"');
    }

    // Check if user exists
    await this.findById(userId);

    // Update user's role type
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        roleType: roleType,
      },
    });
  }
}