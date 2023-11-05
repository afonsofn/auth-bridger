import { AuthGuard } from '@nestjs/passport';
import { FACEBOOK_STRATEGY } from 'src/utils';

export class FacebookGuard extends AuthGuard(FACEBOOK_STRATEGY) {}
