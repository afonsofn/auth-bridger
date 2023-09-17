import { AuthGuard } from '@nestjs/passport';
import { OAUTH_STRATEGY } from 'src/utils';

export class OauthGuard extends AuthGuard(OAUTH_STRATEGY) {}
