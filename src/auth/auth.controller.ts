import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogonDto } from './dto';
import { JwtGuard, OauthGuard } from './guards';
import { GetToken, GetUser } from 'src/auth/decorators';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { Response } from 'express';
import { cookieAccessToken } from 'src/utils';

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

  @Get('google/callback')
  @UseGuards(OauthGuard)
  async googleCallbackAuth(@GetUser() user, @Res() res: Response) {
    const token = await this.authService.googleLogin(user);

    return cookieAccessToken(token, res);
  }

  @Get('google')
  @UseGuards(OauthGuard)
  googleAuth() {}

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@GetToken() token: string) {
    return this.authService.logout(token);
  }
}
