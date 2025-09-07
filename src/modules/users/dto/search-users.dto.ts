import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchUsersDto {
  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Search term for username, email, firstName, or lastName (leave empty to show all users)' 
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    enum: ['admin', 'support'],
    description: 'Filter by role type (leave empty to show all roles)' 
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'support'], { message: 'Role type must be either "admin" or "support"' })
  roleType?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter by active status (leave empty to show all statuses)' 
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
    example: '', 
    required: false, 
    description: 'Filter by email verification status (leave empty to show all verification statuses)' 
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
    example: '', 
    required: false, 
    description: 'Filter users created after this date (YYYY-MM-DD) - leave empty for no start date' 
  })
  @IsOptional()
  @IsString()
  createdAfter?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter users created before this date (YYYY-MM-DD) - leave empty for no end date' 
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
