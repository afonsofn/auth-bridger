import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGY } from 'src/utils';

export class JwtGuard extends AuthGuard(JWT_STRATEGY) {}
