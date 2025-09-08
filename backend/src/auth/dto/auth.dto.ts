import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  WORKER = 'worker',
  EMPLOYER = 'employer',
}

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.WORKER })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class SignInDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.WORKER })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
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

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: UserProfileDto;
}
