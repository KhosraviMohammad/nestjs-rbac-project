import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AuditLogQueryDto {
  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Search by action, resource, or user role (leave empty to show all)' 
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter by action type (leave empty to show all)' 
  })
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter by resource type (leave empty to show all)' 
  })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter by user role (leave empty to show all roles)' 
  })
  @IsOptional()
  @IsString()
  userRole?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter by success status (leave empty to show all)' 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter logs after this date (YYYY-MM-DD) - leave empty for no start date' 
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ 
    example: '', 
    required: false, 
    description: 'Filter logs before this date (YYYY-MM-DD) - leave empty for no end date' 
  })
  @IsOptional()
  @IsString()
  endDate?: string;

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
    example: 50, 
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
  limit?: number = 50;
}
