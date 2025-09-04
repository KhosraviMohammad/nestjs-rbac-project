import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsEmail, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'support', required: false, enum: ['admin', 'support'] })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'support'], { message: 'Role type must be either "admin" or "support"' })
  role?: string;
}
