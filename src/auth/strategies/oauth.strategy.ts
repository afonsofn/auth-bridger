import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OAUTH_STRATEGY,
} from 'src/utils';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, OAUTH_STRATEGY) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get(GOOGLE_CLIENT_ID),
      clientSecret: configService.get(GOOGLE_CLIENT_SECRET),
      callbackURL: configService.get(GOOGLE_CALLBACK_URL),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;

    console.log(profile);
    const user = {
      provider: OAUTH_STRATEGY,
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };

    done(null, user);
  }
}
