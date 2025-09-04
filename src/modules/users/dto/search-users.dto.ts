import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchUsersDto {
  @ApiProperty({ 
    example: 'john', 
    required: false, 
    description: 'Search term for username, email, firstName, or lastName' 
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: 'admin', 
    required: false, 
    enum: ['admin', 'support'],
    description: 'Filter by role type' 
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'support'], { message: 'Role type must be either "admin" or "support"' })
  roleType?: string;

  @ApiProperty({ 
    example: true, 
    required: false, 
    description: 'Filter by active status' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    example: true, 
    required: false, 
    description: 'Filter by email verification status' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  emailVerified?: boolean;

  @ApiProperty({ 
    example: '2024-01-01', 
    required: false, 
    description: 'Filter users created after this date (YYYY-MM-DD)' 
  })
  @IsOptional()
  @IsString()
  createdAfter?: string;

  @ApiProperty({ 
    example: '2024-12-31', 
    required: false, 
    description: 'Filter users created before this date (YYYY-MM-DD)' 
  })
  @IsOptional()
  @IsString()
  createdBefore?: string;

  @ApiProperty({ 
    example: 1, 
    required: false, 
    description: 'Page number (starts from 1)',
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    example: 10, 
    required: false, 
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
