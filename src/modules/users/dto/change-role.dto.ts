import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role type to assign to user', enum: ['admin', 'support'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'support'], { message: 'Role type must be either "admin" or "support"' })
  roleType: string;
}
