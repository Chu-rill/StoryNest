import { Controller, Post, Get, Put, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);

    // Send welcome email
    try {
      await this.mailService.sendEmailWithTemplate(registerDto.email, {
        subject: 'Welcome to StoryNest',
        username: registerDto.username,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.userService.getUserProfile(user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'User profile retrieved successfully',
      profile,
    };
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return {
      status: 'success',
      statusCode: 200,
      message: 'Users retrieved successfully',
      users,
    };
  }

  @Post('follow/:id')
  async followUser(@CurrentUser() user: any, @Param('id') targetUserId: string) {
    await this.userService.followUser(user.id, targetUserId);
    return {
      status: 'success',
      statusCode: 200,
      message: 'User followed successfully',
    };
  }

  @Post('unfollow/:id')
  async unfollowUser(@CurrentUser() user: any, @Param('id') targetUserId: string) {
    await this.userService.unfollowUser(user.id, targetUserId);
    return {
      status: 'success',
      statusCode: 200,
      message: 'User unfollowed successfully',
    };
  }

  @Put('update')
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUserProfile(user.id, updateUserDto);
    return {
      status: 'success',
      statusCode: 200,
      message: 'User profile updated successfully',
      user: updatedUser,
    };
  }

  @Get('user/:id')
  async getUserProfile(@Param('id') userId: string) {
    const profile = await this.userService.getUserProfile(userId);
    return {
      status: 'success',
      statusCode: 200,
      message: 'User profile retrieved successfully',
      profile,
    };
  }
}
