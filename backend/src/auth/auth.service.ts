import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { createSupabaseClient } from '../config/supabase.config';
import { UsersService, UserProfile } from '../users/users.service';
import { UserRole } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private supabase = createSupabaseClient();

  constructor(
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, expectedRole?: UserRole): Promise<UserProfile | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (!user) {
        return null;
      }

      // If role is specified, validate it matches
      if (expectedRole && user.user_type !== expectedRole) {
        throw new UnauthorizedException(`User is not a ${expectedRole}`);
      }

      return user;
    } catch (error) {
      this.logger.error('Error validating user:', error);
      throw error;
    }
  }

  async validateUserById(userId: string): Promise<UserProfile | null> {
    try {
      return await this.usersService.findById(userId);
    } catch (error) {
      this.logger.error('Error validating user by ID:', error);
      throw error;
    }
  }


  async verifyGoogleAuth(token: string): Promise<UserProfile | null> {
    try {
      // Verify the JWT token from Google OAuth
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      // Find user in our database
      const userProfile = await this.usersService.findById(user.id);
      
      return userProfile;
    } catch (error) {
      this.logger.error('Error verifying Google auth:', error);
      throw error;
    }
  }


  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const user = await this.usersService.findById(userId);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error('Error getting profile:', error);
      throw error;
    }
  }
}
