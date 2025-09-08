import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserRole } from '../dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true, // This allows us to access the request object
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    // For OAuth-based auth, we don't use password
    // This strategy is mainly for compatibility, actual auth happens via Supabase OAuth
    const expectedRole = req.body.role as UserRole;
    
    const user = await this.authService.validateUser(email, expectedRole);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }
}
