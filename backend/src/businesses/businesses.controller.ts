import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessResponseDto } from './dto/business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/dto/auth.dto';

@ApiTags('Businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Roles(UserRole.EMPLOYER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business created successfully', type: BusinessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Employer role required' })
  async createBusiness(
    @Request() req: any,
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    const employerId = req.user.sub; // JWT sub claim contains user ID
    return this.businessesService.createBusiness(employerId, createBusinessDto);
  }

  @Get()
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Get all businesses for the authenticated employer' })
  @ApiResponse({ status: 200, description: 'Businesses retrieved successfully', type: [BusinessResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Employer role required' })
  async findMyBusinesses(@Request() req: any): Promise<BusinessResponseDto[]> {
    const employerId = req.user.sub;
    return this.businessesService.findBusinessesByEmployer(employerId);
  }

  @Get(':id')
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Get a specific business by ID' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully', type: BusinessResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Employer role required' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async findBusinessById(
    @Request() req: any,
    @Param('id') businessId: string,
  ): Promise<BusinessResponseDto> {
    const employerId = req.user.sub;
    return this.businessesService.findBusinessById(businessId, employerId);
  }

  @Put(':id')
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({ status: 200, description: 'Business updated successfully', type: BusinessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Employer role required' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async updateBusiness(
    @Request() req: any,
    @Param('id') businessId: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<BusinessResponseDto> {
    const employerId = req.user.sub;
    return this.businessesService.updateBusiness(businessId, employerId, updateBusinessDto);
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a business (soft delete)' })
  @ApiResponse({ status: 204, description: 'Business deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Employer role required' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async deleteBusiness(
    @Request() req: any,
    @Param('id') businessId: string,
  ): Promise<void> {
    const employerId = req.user.sub;
    return this.businessesService.deleteBusiness(businessId, employerId);
  }
}
