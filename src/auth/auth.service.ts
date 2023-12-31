import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { GoogleLoginDto, LoginDto, LogonDto } from '@/auth/dto';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import {
  CREDENTIALS_FAILED_EMAIL,
  CREDENTIALS_FAILED_PASSWORD,
  CREDENTIALS_INCORRECT,
  CREDENTIALS_TAKEN_BY_JWT,
  CREDENTIALS_TAKEN_PROVIDER_CONFLICT,
  JWT_EXPIRE_TIME,
  JWT_SECRET,
  UNAUTHENTICATED,
  handleExceptions,
  validateEmail,
  validatePassword,
} from '@/utils';

@Injectable()
export class AuthService {
  constructor(
    private redisService: RedisService,
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async logon(dto: LogonDto): Promise<string> {
    try {
      if (!validateEmail(dto.email)) {
        throw new BadRequestException(CREDENTIALS_FAILED_EMAIL);
      }

      if (!dto.provider && !validatePassword(dto.password)) {
        throw new BadRequestException(CREDENTIALS_FAILED_PASSWORD);
      }

      const hash = await argon.hash(dto.password);

      delete dto.password;

      const user = await this.prismaService.user.create({
        data: { ...dto, hash },
      });

      return this.generateAccessToken({ sub: user.id, email: user.email });
    } catch (error) {
      handleExceptions(error);
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) throw new ForbiddenException(CREDENTIALS_INCORRECT);

      const pwMatches = await argon.verify(user.hash, password);

      if (!pwMatches) throw new ForbiddenException(CREDENTIALS_INCORRECT);

      return this.generateAccessToken({ sub: user.id, email: user.email });
    } catch (error) {
      handleExceptions(error);
    }
  }

  async providersLogin(dto: GoogleLoginDto) {
    try {
      if (!dto) throw new ForbiddenException(UNAUTHENTICATED);

      const user = await this.prismaService.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        const providerId = dto.providerId;

        delete dto.providerId;

        return this.logon({ ...dto, password: providerId });
      }

      if (!user.provider)
        throw new ForbiddenException(CREDENTIALS_TAKEN_BY_JWT);

      if (user.provider !== dto.provider)
        throw new ForbiddenException(CREDENTIALS_TAKEN_PROVIDER_CONFLICT);

      const pwMatches = await argon.verify(user.hash, dto.providerId);

      if (!pwMatches) throw new ForbiddenException(CREDENTIALS_INCORRECT);

      return this.generateAccessToken({ sub: user.id, email: user.email });
    } catch (error) {
      handleExceptions(error);
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const decodedToken: any = this.jwtService.decode(token);
      const expiryTime = decodedToken.exp - Math.floor(Date.now() / 1000);

      await this.redisService.addToBlacklist(token, expiryTime);
    } catch (error) {
      handleExceptions(error);
    }
  }

  async generateAccessToken(payload: {
    sub: number;
    email: string;
  }): Promise<string> {
    const secret = this.configService.get(JWT_SECRET);

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: JWT_EXPIRE_TIME,
      secret,
    });

    return access_token;
  }
}
