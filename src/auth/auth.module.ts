import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import {
  JwtStrategy,
  GoogleStrategy,
  FacebookStrategy,
} from '@/auth/strategies';
import { RedisService } from '@/redis/redis.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    RedisService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
