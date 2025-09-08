import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { SignUpDto, SignInDto, AuthResponseDto, UserProfileDto, UserRole } from './dto/auth.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Complete user registration after OAuth' })
  @ApiResponse({ status: 201, description: 'User profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - User must complete OAuth first' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login with role validation' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials or wrong role' })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any): Promise<UserProfileDto> {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async signOut(@Request() req: any) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.EMPLOYER)
  @Get('employer-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get employer profile - Employer only' })
  @ApiResponse({ status: 200, description: 'Employer profile retrieved', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Employer role required' })
  async getEmployerProfile(@Request() req: any): Promise<UserProfileDto> {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.WORKER)
  @Get('worker-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get worker profile - Worker only' })
  @ApiResponse({ status: 200, description: 'Worker profile retrieved', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Worker role required' })
  async getWorkerProfile(@Request() req: any): Promise<UserProfileDto> {
    return this.authService.getProfile(req.user.sub);
  }
}
