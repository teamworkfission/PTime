import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createJobDto: any) {
    // Note: employerId should be extracted from JWT token in real implementation
    const employerId = 'temp-employer-id'; // This should come from JWT payload
    return this.jobsService.createJob(employerId, createJobDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateJobDto: any) {
    // Note: employerId should be extracted from JWT token in real implementation
    const employerId = 'temp-employer-id'; // This should come from JWT payload
    return this.jobsService.update(id, employerId, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    // Note: employerId should be extracted from JWT token in real implementation
    const employerId = 'temp-employer-id'; // This should come from JWT payload
    return this.jobsService.delete(id, employerId);
  }
}
