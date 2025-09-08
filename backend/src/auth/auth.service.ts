import { Injectable, BadRequestException, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createSupabaseClient } from '../config/supabase.config';
import { UsersService, UserProfile } from '../users/users.service';
import { SignUpDto, SignInDto, UserRole } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private supabase = createSupabaseClient();

  constructor(
    private jwtService: JwtService,
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

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    try {
      // Check if user already exists in our database
      const existingUser = await this.usersService.findByEmail(signUpDto.email);
      if (existingUser) {
        throw new ConflictException('User already exists. Please use sign in instead.');
      }

      // Check if user exists in Supabase Auth
      const { data: authUsers, error: authError } = await this.supabase.auth.admin.listUsers();
      
      if (authError) {
        this.logger.error('Error checking auth users:', authError);
        throw new BadRequestException('Authentication service error');
      }

      const existingAuthUser = authUsers.users.find((user: any) => user.email === signUpDto.email);
      
      if (!existingAuthUser) {
        throw new BadRequestException('User must complete OAuth signup first');
      }

      // Create user profile in our database
      await this.usersService.create({
        id: existingAuthUser.id,
        email: signUpDto.email,
        user_type: signUpDto.role,
      });

      return { message: 'User profile created successfully' };
    } catch (error) {
      this.logger.error('Error in signup:', error);
      throw error;
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string; user: UserProfile }> {
    try {
      // Validate user exists and has correct role
      const user = await this.validateUser(signInDto.email, signInDto.role);
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials or user does not exist');
      }

      // Generate JWT token
      const payload = { 
        email: user.email, 
        sub: user.id, 
        role: user.user_type 
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user,
      };
    } catch (error) {
      this.logger.error('Error in signin:', error);
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

  async logout(userId: string): Promise<{ message: string }> {
    try {
      // For Supabase, logout is mainly handled on the client side
      // We could implement token blacklisting here if needed
      this.logger.log(`User ${userId} logged out`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Error in logout:', error);
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
