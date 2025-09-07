import { Injectable } from '@nestjs/common';
import { MainDatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { PaginatedUsersDto, PaginationMeta } from './dto/paginated-users.dto';
import { PasswordUtil } from '../../common/utils/password.util';
import {
  createUserNotFoundError,
  createEmailExistsError,
  createUsernameExistsError,
  createUserAlreadyLockedError,
  createUserAlreadyUnlockedError,
  createInvalidRoleTypeError,
} from '../../common/errors/app-errors';

@Injectable()
export class UsersService {
  constructor(
    public readonly prisma: MainDatabaseService,
  ) {}

  async create(createUserDto: CreateUserDto, prismaClient: any = this.prisma) {
    // Check if email already exists
    const existingUserByEmail = await prismaClient.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw createEmailExistsError();
    }

    // Check if username already exists
    const existingUserByUsername = await prismaClient.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw createUsernameExistsError();
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hashPassword(createUserDto.password);

    // Create user with roleType
    const user = await prismaClient.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        roleType: 'support', // Default role for new users
      },
    });

    return user;
  }

  async findAll(searchParams?: SearchUsersDto): Promise<PaginatedUsersDto> {
    const where: any = {};

    // Search functionality
    if (searchParams?.search) {
      where.OR = [
        { username: { contains: searchParams.search, mode: 'insensitive' } },
        { email: { contains: searchParams.search, mode: 'insensitive' } },
        { firstName: { contains: searchParams.search, mode: 'insensitive' } },
        { lastName: { contains: searchParams.search, mode: 'insensitive' } },
      ];
    }

    // Filter by role type
    if (searchParams?.roleType) {
      where.roleType = searchParams.roleType;
    }

    // Filter by active status
    if (searchParams?.isActive !== undefined) {
      where.isActive = searchParams.isActive;
    }

    // Filter by email verification status
    if (searchParams?.emailVerified !== undefined) {
      where.emailVerified = searchParams.emailVerified;
    }

    // Filter by creation date
    if (searchParams?.createdAfter) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(searchParams.createdAfter),
      };
    }

    if (searchParams?.createdBefore) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(searchParams.createdBefore),
      };
    }

    // Pagination parameters
    const page = searchParams?.page || 1;
    const limit = searchParams?.limit || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await this.prisma.user.count({ where });

    // Get paginated data
    const data = await this.prisma.user.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };

    return {
      data,
      meta,
    };
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw createUserNotFoundError(id);
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
      throw createUserAlreadyLockedError();
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
      throw createUserAlreadyUnlockedError();
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findById(id);

    // Check if username is being changed and if it already exists
    if (updateUserDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username: updateUserDto.username,
          id: { not: id }
        }
      });
      
      if (existingUser) {
        throw createUsernameExistsError();
      }
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id }
        }
      });
      
      if (existingUser) {
        throw createEmailExistsError();
      }
    }

    // Update user data
    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        username: updateUserDto.username,
        email: updateUserDto.email,
      },
    });
  }

  async changeUserRole(userId: number, roleType: string) {
    // Validate role type
    if (!['admin', 'support'].includes(roleType)) {
      throw createInvalidRoleTypeError();
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