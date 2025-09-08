import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { createSupabaseClient, TABLES } from '../config/supabase.config';
import { UserRole } from '../auth/dto/auth.dto';

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string | null;
  location: string | null;
  hourly_rate: number | null;
  status: 'active' | 'filled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateJobDto {
  title: string;
  description?: string;
  location?: string;
  hourly_rate?: number;
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  location?: string;
  hourly_rate?: number;
  status?: 'active' | 'filled' | 'cancelled';
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private supabase = createSupabaseClient();

  async createJob(employerId: string, createJobDto: CreateJobDto): Promise<Job> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.JOBS)
        .insert([
          {
            employer_id: employerId,
            ...createJobDto,
          },
        ])
        .select()
        .single();

      if (error) {
        this.logger.error('Error creating job:', error);
        throw new Error('Failed to create job');
      }

      return data;
    } catch (error) {
      this.logger.error('Error creating job:', error);
      throw error;
    }
  }

  async getJobsByEmployer(employerId: string): Promise<Job[]> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.JOBS)
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching jobs by employer:', error);
        throw new Error('Failed to fetch jobs');
      }

      return data || [];
    } catch (error) {
      this.logger.error('Error fetching jobs by employer:', error);
      throw error;
    }
  }

  async findAll(): Promise<Job[]> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.JOBS)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching all jobs:', error);
        throw new Error('Failed to fetch jobs');
      }

      return data || [];
    } catch (error) {
      this.logger.error('Error fetching all jobs:', error);
      throw error;
    }
  }

  async findById(jobId: string): Promise<Job | null> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.JOBS)
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        this.logger.error('Error fetching job by id:', error);
        throw new Error('Failed to fetch job');
      }

      return data;
    } catch (error) {
      this.logger.error('Error fetching job by id:', error);
      throw error;
    }
  }

  async update(
    jobId: string,
    employerId: string,
    updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    try {
      // First verify the job belongs to this employer
      const existingJob = await this.findById(jobId);
      
      if (!existingJob) {
        throw new NotFoundException('Job not found');
      }

      if (existingJob.employer_id !== employerId) {
        throw new ForbiddenException('You can only update your own jobs');
      }

      const { data, error } = await this.supabase
        .from(TABLES.JOBS)
        .update({
          ...updateJobDto,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId)
        .eq('employer_id', employerId)
        .select()
        .single();

      if (error) {
        this.logger.error('Error updating job:', error);
        throw new Error('Failed to update job');
      }

      return data;
    } catch (error) {
      this.logger.error('Error updating job:', error);
      throw error;
    }
  }

  async delete(jobId: string, employerId: string): Promise<{ message: string }> {
    try {
      // First verify the job belongs to this employer
      const existingJob = await this.findById(jobId);
      
      if (!existingJob) {
        throw new NotFoundException('Job not found');
      }

      if (existingJob.employer_id !== employerId) {
        throw new ForbiddenException('You can only delete your own jobs');
      }

      const { error } = await this.supabase
        .from(TABLES.JOBS)
        .delete()
        .eq('id', jobId)
        .eq('employer_id', employerId);

      if (error) {
        this.logger.error('Error deleting job:', error);
        throw new Error('Failed to delete job');
      }

      return { message: 'Job deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting job:', error);
      throw error;
    }
  }
}
