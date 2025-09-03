import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role name to assign to user' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
