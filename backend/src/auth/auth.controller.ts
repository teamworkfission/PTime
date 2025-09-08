import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  async signUp(@Body() signUpDto: any) {
    // TODO: Implement signup logic with Supabase
    return { message: 'Signup endpoint - To be implemented' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  async signIn(@Request() req: any) {
    // TODO: Implement signin logic
    return { message: 'Signin endpoint - To be implemented' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('signout')
  @ApiOperation({ summary: 'User logout' })
  async signOut() {
    // TODO: Implement signout logic
    return { message: 'Signout endpoint - To be implemented' };
  }
}
