import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, OauthStrategy } from './strategies';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy, OauthStrategy, RedisService],
  controllers: [AuthController],
})
export class AuthModule {}
