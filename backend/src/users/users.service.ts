import { Injectable, Logger } from '@nestjs/common';
import { createSupabaseClient, TABLES } from '../config/supabase.config';
import { UserRole } from '../auth/dto/auth.dto';

export interface UserProfile {
  id: string;
  email: string;
  user_type: UserRole;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private supabase = createSupabaseClient();

  async findByEmail(email: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.USER_PROFILES)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        this.logger.error('Error finding user by email:', error);
        throw new Error('Database error');
      }

      return data;
    } catch (error) {
      this.logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.USER_PROFILES)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        this.logger.error('Error finding user by id:', error);
        throw new Error('Database error');
      }

      return data;
    } catch (error) {
      this.logger.error('Error finding user by id:', error);
      throw error;
    }
  }

  async create(userData: { id: string; email: string; user_type: UserRole }): Promise<UserProfile> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.USER_PROFILES)
        .insert([userData])
        .select()
        .single();

      if (error) {
        this.logger.error('Error creating user:', error);
        throw new Error('Failed to create user profile');
      }

      return data;
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<Pick<UserProfile, 'email' | 'user_type'>>): Promise<UserProfile> {
    try {
      const { data, error } = await this.supabase
        .from(TABLES.USER_PROFILES)
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error('Error updating user:', error);
        throw new Error('Failed to update user profile');
      }

      return data;
    } catch (error) {
      this.logger.error('Error updating user:', error);
      throw error;
    }
  }

  async validateUserRole(userId: string, expectedRole: UserRole): Promise<boolean> {
    try {
      const user = await this.findById(userId);
      return user?.user_type === expectedRole;
    } catch (error) {
      this.logger.error('Error validating user role:', error);
      return false;
    }
  }
}
