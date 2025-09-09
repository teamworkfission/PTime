import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsObject, IsBoolean, IsUUID } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Business type' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Business email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Business phone', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Street address' })
  @IsString()
  address_street: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  address_city: string;

  @ApiProperty({ description: 'County' })
  @IsString()
  address_county: string;

  @ApiProperty({ description: 'State' })
  @IsString()
  address_state: string;

  @ApiProperty({ description: 'ZIP code' })
  @IsString()
  address_zipcode: string;

  @ApiProperty({ description: 'Google Maps data', required: false })
  @IsObject()
  @IsOptional()
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };
}

export class UpdateBusinessDto {
  @ApiProperty({ description: 'Business name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Business type', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Business email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Business phone', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Street address', required: false })
  @IsString()
  @IsOptional()
  address_street?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsString()
  @IsOptional()
  address_city?: string;

  @ApiProperty({ description: 'County', required: false })
  @IsString()
  @IsOptional()
  address_county?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsString()
  @IsOptional()
  address_state?: string;

  @ApiProperty({ description: 'ZIP code', required: false })
  @IsString()
  @IsOptional()
  address_zipcode?: string;

  @ApiProperty({ description: 'Google Maps data', required: false })
  @IsObject()
  @IsOptional()
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };

  @ApiProperty({ description: 'Business active status', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class BusinessResponseDto {
  @ApiProperty({ description: 'Business ID' })
  id: string;

  @ApiProperty({ description: 'Employer ID' })
  employer_id: string;

  @ApiProperty({ description: 'Business name' })
  name: string;

  @ApiProperty({ description: 'Business type' })
  type: string;

  @ApiProperty({ description: 'Business email', required: false })
  email?: string;

  @ApiProperty({ description: 'Business phone', required: false })
  phone?: string;

  @ApiProperty({ description: 'Street address' })
  address_street: string;

  @ApiProperty({ description: 'City' })
  address_city: string;

  @ApiProperty({ description: 'County' })
  address_county: string;

  @ApiProperty({ description: 'State' })
  address_state: string;

  @ApiProperty({ description: 'ZIP code' })
  address_zipcode: string;

  @ApiProperty({ description: 'Google Maps data', required: false })
  google_maps_data?: {
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address?: string;
  };

  @ApiProperty({ description: 'Business active status' })
  is_active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: string;
}
