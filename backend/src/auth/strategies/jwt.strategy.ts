import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { createSupabaseClient } from '../../config/supabase.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private supabase = createSupabaseClient();

  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any) {
    try {
      // Extract Bearer token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No valid authorization header found');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Validate token with Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Get user profile from our database
      const userProfile = await this.authService.validateUserById(user.id);
      
      if (!userProfile) {
        throw new UnauthorizedException('User profile not found');
      }

      // Return user object that will be attached to request.user
      return {
        id: userProfile.id,
        email: userProfile.email,
        user_type: userProfile.user_type,
        sub: userProfile.id, // Keep 'sub' for compatibility with existing controllers
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(`Authentication failed: ${error.message}`);
    }
  }
}
