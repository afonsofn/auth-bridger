import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@/auth/auth.service';
import { LoginDto, LogonDto } from '@/auth/dto';
import { JwtGuard, GoogleGuard, FacebookGuard } from '@/auth/guards';
import { GetToken, GetUser } from '@/auth/decorators';
import { CustomExceptionFilter } from '@/auth/filters/custom-exception.filter';
import { cookieAccessToken } from '@/utils';

@Controller('auth')
@UseFilters(new CustomExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('logon')
  async logon(@Body() dto: LogonDto, @Res() res: Response) {
    const token = await this.authService.logon(dto);

    return cookieAccessToken(token, res);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(dto);

    return cookieAccessToken(token, res);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}

  @Get('facebook')
  @UseGuards(FacebookGuard)
  facebookAuth() {}

  @Get('google/callback')
  @Get('facebook/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@GetUser() user, @Res() res: Response) {
    const token = await this.authService.providersLogin(user);

    return cookieAccessToken(token, res);
  }

  @Get('facebook/callback')
  @UseGuards(FacebookGuard)
  async facebookCallback(@GetUser() user, @Res() res: Response) {
    const token = await this.authService.providersLogin(user);

    return cookieAccessToken(token, res);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@GetToken() token: string) {
    return this.authService.logout(token);
  }
}
