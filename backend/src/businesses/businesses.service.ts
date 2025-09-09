import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateBusinessDto, UpdateBusinessDto, BusinessResponseDto } from './dto/business.dto';
import { createSupabaseClient } from '../config/supabase.config';

@Injectable()
export class BusinessesService {
  private readonly supabase = createSupabaseClient();
  
  async createBusiness(employerId: string, createBusinessDto: CreateBusinessDto): Promise<BusinessResponseDto> {
    try {
      // First ensure the employer record exists
      await this.ensureEmployerExists(employerId);

      const { data, error } = await this.supabase
        .from('businesses')
        .insert({
          employer_id: employerId,
          ...createBusinessDto,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create business: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Business creation failed: ${error.message}`);
    }
  }

  async findBusinessesByEmployer(employerId: string): Promise<BusinessResponseDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('businesses')
        .select('*')
        .eq('employer_id', employerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch businesses: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Business fetch failed: ${error.message}`);
    }
  }

  async findBusinessById(businessId: string, employerId: string): Promise<BusinessResponseDto> {
    try {
      const { data, error } = await this.supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('employer_id', employerId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Business not found');
        }
        throw new Error(`Failed to fetch business: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Business fetch failed: ${error.message}`);
    }
  }

  async updateBusiness(businessId: string, employerId: string, updateBusinessDto: UpdateBusinessDto): Promise<BusinessResponseDto> {
    try {
      // Verify business belongs to employer
      await this.findBusinessById(businessId, employerId);

      const { data, error } = await this.supabase
        .from('businesses')
        .update({
          ...updateBusinessDto,
          updated_at: new Date().toISOString(),
        })
        .eq('id', businessId)
        .eq('employer_id', employerId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update business: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Business update failed: ${error.message}`);
    }
  }

  async deleteBusiness(businessId: string, employerId: string): Promise<void> {
    try {
      // Verify business belongs to employer
      await this.findBusinessById(businessId, employerId);

      // Soft delete by setting is_active to false
        const { error } = await this.supabase
        .from('businesses')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', businessId)
        .eq('employer_id', employerId);

      if (error) {
        throw new Error(`Failed to delete business: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Business deletion failed: ${error.message}`);
    }
  }

  private async ensureEmployerExists(employerId: string): Promise<void> {
    try {
      // Check if employer record exists
      const { data: employer, error: employerError } = await this.supabase
        .from('employers')
        .select('user_id')
        .eq('user_id', employerId)
        .single();

      if (employerError && employerError.code === 'PGRST116') {
        // Employer doesn't exist, get user profile data to create it
        const { data: userProfile, error: profileError } = await this.supabase
          .from('user_profiles')
          .select('*')
          .eq('id', employerId)
          .eq('user_type', 'employer')
          .single();

        if (profileError) {
          throw new ForbiddenException('Invalid employer user');
        }

        // Create employer record
        const { error: createError } = await this.supabase
          .from('employers')
          .insert({
            user_id: employerId,
            display_name: userProfile.email.split('@')[0], // Use email prefix as display name
            email: userProfile.email,
          });

        if (createError) {
          throw new Error(`Failed to create employer record: ${createError.message}`);
        }
      } else if (employerError) {
        throw new Error(`Employer lookup failed: ${employerError.message}`);
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Employer validation failed: ${error.message}`);
    }
  }
}
