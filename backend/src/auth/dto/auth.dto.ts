import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  EMPLOYEE = 'employee',
  EMPLOYER = 'employer',
}


export class UserProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  user_type: UserRole;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

